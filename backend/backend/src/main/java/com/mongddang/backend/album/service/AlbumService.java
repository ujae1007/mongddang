package com.mongddang.backend.album.service;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.album.repository.AlbumRepository;
import com.mongddang.backend.playlist.repository.PlaylistRepository;
import com.mongddang.backend.photo.repository.PhotoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final PlaylistRepository playlistRepository;
    private final PhotoRepository photoRepository;

    public AlbumService(AlbumRepository albumRepository, PlaylistRepository playlistRepository, PhotoRepository photoRepository) {
        this.albumRepository = albumRepository;
        this.playlistRepository = playlistRepository;
        this.photoRepository = photoRepository;
    }

    @Transactional
    public AlbumResponseDto createAlbum(AlbumRequestDto albumRequestDto) {  
        Album album = new Album(
            albumRequestDto.getUserId(),
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
            savedAlbum.getViewCount(),
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
}
