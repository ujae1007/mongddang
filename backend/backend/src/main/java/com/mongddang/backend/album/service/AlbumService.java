package com.mongddang.backend.album.service;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.album.repository.AlbumRepository;
import com.mongddang.backend.playlist.repository.PlaylistRepository;
import com.mongddang.backend.photo.repository.PhotoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final PlaylistRepository playlistRepository;
    private final PhotoRepository photoRepository;
    private final UserService userService;
    
    public AlbumService(AlbumRepository albumRepository, PlaylistRepository playlistRepository, PhotoRepository photoRepository, UserService userService) {
        this.albumRepository = albumRepository;
        this.playlistRepository = playlistRepository;
        this.photoRepository = photoRepository;
        this.userService = userService;
    }

    @Transactional
    public AlbumResponseDto createAlbum(AlbumRequestDto albumRequestDto, int userId) {  
        Album album = new Album(
        	userId,
//            albumRequestDto.getUserId(),
            albumRequestDto.getTitle(),
            albumRequestDto.getAlbumImageUrl(),
            albumRequestDto.isStatus()
        );

        Album savedAlbum = albumRepository.save(album);

        return new AlbumResponseDto(
            savedAlbum.getAlbumId(),
            savedAlbum.getUserId(),
            savedAlbum.getTitle(),
            savedAlbum.getAlbumImageUrl(),
            savedAlbum.isStatus(),
            savedAlbum.getCreatedAt(),
            savedAlbum.getUpdatedAt()
        );
    }
    
    @Transactional
    public void deleteAlbum(int albumId) {
        if (!albumRepository.existsById(albumId)) {
            throw new IllegalArgumentException("존재하지 않는 Album입니다.");
        }

        // 1️⃣ Photo 삭제
        playlistRepository.findByAlbum_AlbumId(albumId)
                .forEach(playlist -> photoRepository.deleteByPlaylist_PlaylistId(playlist.getPlaylistId()));

        // 2️⃣ Playlist 삭제
        playlistRepository.deleteByAlbum_AlbumId(albumId);

        // 3️⃣ Album 삭제
        albumRepository.deleteById(albumId);
    }
    
    // ✅ 모든 사용자의 공개된 앨범 조회 (Playlist 정보 제외)
    @Transactional(readOnly = true)
    public List<AlbumResponseDto> getAllPublicAlbums() {
//        List<Album> albums = albumRepository.findByStatus(true);
        List<Album> albums = albumRepository.findByStatus(false);
        return albums.stream().map(this::toSimpleAlbumResponseDto).collect(Collectors.toList());
    }

    // ✅ 내 앨범 조회 (Playlist 정보 제외)
    @Transactional(readOnly = true)
    public List<AlbumResponseDto> getMyAlbums(Principal principal) {
        String email = principal.getName();
        int userId = userService.getUserByEmail(email).getUserId();  // ✅ UserService를 사용하여 userId 조회
        List<Album> albums = albumRepository.findByUserId(userId);
        return albums.stream().map(this::toSimpleAlbumResponseDto).collect(Collectors.toList());
    }

    // ✅ 특정 사용자의 공개된 앨범 조회 (Playlist 정보 제외)
    @Transactional(readOnly = true)
    public List<AlbumResponseDto> getUserPublicAlbums(int userId) {
//        List<Album> albums = albumRepository.findByUserIdAndStatus(userId, true);
        List<Album> albums = albumRepository.findByUserIdAndStatus(userId, false);
        return albums.stream().map(this::toSimpleAlbumResponseDto).collect(Collectors.toList());
    }

    // ✅ 특정 앨범 상세 조회 (Playlist 포함)
    @Transactional(readOnly = true)
    public AlbumResponseDto getAlbumById(int albumId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("해당 앨범을 찾을 수 없습니다: " + albumId));

        List<PlaylistDto> playlists = playlistRepository.findByAlbum_AlbumId(albumId).stream()
                .map(PlaylistDto::new)
                .collect(Collectors.toList());

        return new AlbumResponseDto(
                album.getAlbumId(),
                album.getUserId(),
                album.getTitle(),
                album.getAlbumImageUrl(),
                album.isStatus(),
                album.getCreatedAt(),
                album.getUpdatedAt(),
                playlists
        );
    }

    // ✅ Playlist 정보 제외한 AlbumResponseDto 생성
    private AlbumResponseDto toSimpleAlbumResponseDto(Album album) {
        return new AlbumResponseDto(
                album.getAlbumId(),
                album.getUserId(),
                album.getTitle(),
                album.getAlbumImageUrl(),
                album.isStatus(),
                album.getCreatedAt(),
                album.getUpdatedAt()
        );
    }
}
