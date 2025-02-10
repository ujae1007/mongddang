package com.mongddang.backend.album.service;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.dto.AlbumUpdateDto;
import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.album.repository.AlbumRepository;
import com.mongddang.backend.playlist.repository.PlaylistRepository;
import com.mongddang.backend.photo.repository.PhotoRepository;
import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.user.service.UserService;
import com.mongddang.backend.music.repository.MusicRepository;
import com.mongddang.backend.music.dto.MusicDetailDto;
import com.mongddang.backend.music.entity.Music;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final PlaylistRepository playlistRepository;
    private final PhotoRepository photoRepository;
    private final UserService userService;
    private final MusicRepository musicRepository;

    public AlbumService(AlbumRepository albumRepository, PlaylistRepository playlistRepository, PhotoRepository photoRepository, UserService userService, MusicRepository musicRepository) {
        this.albumRepository = albumRepository;
        this.playlistRepository = playlistRepository;
        this.photoRepository = photoRepository;
        this.userService = userService;
        this.musicRepository = musicRepository;
    }

    @Transactional
    public AlbumResponseDto createAlbum(AlbumRequestDto albumRequestDto, int userId) {  
        Album album = new Album(
            userId,
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
    public AlbumResponseDto updateAlbumComplete(int albumId, AlbumUpdateDto albumUpdateDto, int currentUserId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("해당 앨범을 찾을 수 없습니다: " + albumId));

        // 소유자가 아닌 경우 예외 발생
        if (album.getUserId() != currentUserId) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        // 제목 수정 (존재하는 경우)
        if (albumUpdateDto.getTitle() != null) {
            album.setTitle(albumUpdateDto.getTitle());
        }
        // status는 무조건 true로 설정
        album.setStatus(true);

        Album updatedAlbum = albumRepository.save(album);

        return new AlbumResponseDto(
            updatedAlbum.getAlbumId(),
            updatedAlbum.getUserId(),
            updatedAlbum.getTitle(),
            updatedAlbum.getAlbumImageUrl(),
            updatedAlbum.isStatus(),
            updatedAlbum.getCreatedAt(),
            updatedAlbum.getUpdatedAt()
        );
    }
    
    // 앨범 제목 수정 - 사용자 소유권 체크 추가
    @Transactional
    public AlbumResponseDto updateAlbumTitle(int albumId, AlbumUpdateDto albumUpdateDto, int currentUserId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("해당 앨범을 찾을 수 없습니다: " + albumId));

        if (album.getUserId() != currentUserId) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        if (albumUpdateDto.getTitle() != null) {
            album.setTitle(albumUpdateDto.getTitle());
        }
        // status는 무조건 false로 설정
        album.setStatus(false);

        Album updatedAlbum = albumRepository.save(album);

        return new AlbumResponseDto(
            updatedAlbum.getAlbumId(),
            updatedAlbum.getUserId(),
            updatedAlbum.getTitle(),
            updatedAlbum.getAlbumImageUrl(),
            updatedAlbum.isStatus(),
            updatedAlbum.getCreatedAt(),
            updatedAlbum.getUpdatedAt()
        );
    }
    
    // 앨범 삭제 - 사용자 소유권 체크 추가
    @Transactional
    public void deleteAlbum(int albumId, int currentUserId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Album입니다."));
        
        if (album.getUserId() != currentUserId) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        // 1️⃣ 연결된 Photo 삭제 (플레이리스트별)
        playlistRepository.findByAlbum_AlbumId(albumId)
                .forEach(playlist -> photoRepository.deleteByPlaylist_PlaylistId(playlist.getPlaylistId()));

        // 2️⃣ 연결된 Playlist 삭제
        playlistRepository.deleteByAlbum_AlbumId(albumId);

        // 3️⃣ 앨범 삭제
        albumRepository.deleteById(albumId);
    }

    // ✅ 모든 사용자의 공개된 앨범 조회 (Playlist 정보 제외)
    @Transactional(readOnly = true)
    public List<AlbumResponseDto> getAllPublicAlbums() {
        List<Album> albums = albumRepository.findByStatus(true);
//        List<Album> albums = albumRepository.findByStatus(false);
        return albums.stream().map(this::toSimpleAlbumResponseDto).collect(Collectors.toList());
    }

    // ✅ 내 앨범 조회 (Playlist 정보 제외)
    @Transactional(readOnly = true)
    public List<AlbumResponseDto> getMyAlbums(Principal principal) {
        String email = principal.getName();
        int userId = userService.getUserByEmail(email).getUserId();  
        List<Album> albums = albumRepository.findByUserId(userId);
        return albums.stream().map(this::toSimpleAlbumResponseDto).collect(Collectors.toList());
    }

    // ✅ 특정 사용자의 공개된 앨범 조회 (Playlist 정보 제외)
    @Transactional(readOnly = true)
    public List<AlbumResponseDto> getUserPublicAlbums(int userId) {
        List<Album> albums = albumRepository.findByUserIdAndStatus(userId, true);
        return albums.stream().map(this::toSimpleAlbumResponseDto).collect(Collectors.toList());
    }

    // ✅ 특정 앨범 상세 조회 (Playlist + Music 포함)
    @Transactional(readOnly = true)
    public AlbumResponseDto getAlbumById(int albumId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("해당 앨범을 찾을 수 없습니다: " + albumId));

        // 플레이리스트 정보 조회
        List<PlaylistDto> playlists = playlistRepository.findByAlbum_AlbumId(albumId).stream()
                .map(playlist -> {
                    PlaylistDto playlistDto = new PlaylistDto(playlist);
                    // 음악 정보 조회
                    if (playlist.getMusicId() != null) {
                        Music music = musicRepository.findById(playlist.getMusicId())
                                .orElseThrow(() -> new IllegalArgumentException("해당 음악을 찾을 수 없습니다: " + playlist.getMusicId()));
                        MusicDetailDto musicDetailDto = new MusicDetailDto();
                        musicDetailDto.setMusicId(music.getMusicId());
                        musicDetailDto.setTrackName(music.getTrackName());
                        musicDetailDto.setArtistName(music.getArtistName());
                        musicDetailDto.setGenre(music.getGenre());
                        musicDetailDto.setPopularity(music.getPopularity());
                        playlistDto.setMusicDetails(musicDetailDto); // PlaylistDto에 Music 정보를 추가
                    }
                    return playlistDto;
                })
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


