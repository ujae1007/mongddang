package com.mongddang.backend.playlist.service;

import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.album.repository.AlbumRepository;
import com.mongddang.backend.photo.entity.Photo;
import com.mongddang.backend.photo.repository.PhotoRepository;
import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.playlist.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final AlbumRepository albumRepository;
    private final PhotoRepository photoRepository;

    public PlaylistService(PlaylistRepository playlistRepository, AlbumRepository albumRepository, PhotoRepository photoRepository) {
        this.playlistRepository = playlistRepository;
        this.albumRepository = albumRepository;
        this.photoRepository = photoRepository;
    }

    @Transactional
    public Playlist createPlaylist(int albumId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid albumId"));
        Playlist playlist = new Playlist(album);
        return playlistRepository.save(playlist);
    }
    @Transactional
    public Playlist updatePlaylist(int playlistId, PlaylistDto dto) {
        Playlist playlist = playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId: " + playlistId));

        playlist.setStartTime(dto.getStartTime());
        playlist.setEndTime(dto.getEndTime());
        playlist.setLatitude(dto.getLatitude());
        playlist.setLongitude(dto.getLongitude());
        playlist.setLocationAddress(dto.getLocationAddress());
        playlist.setMusicId(dto.getMusicId());  // ✅ musicId만 저장하도록 변경

        if (dto.getPhotoUrls() != null) {
            // 최대 5개 제한 (새롭게 들어온 Photo URL 목록에서 최대 5개만 사용)
            List<String> newPhotoUrls = dto.getPhotoUrls().stream().limit(5).collect(Collectors.toList());
            
            // 기존 Playlist에 연결된 Photo들을 삭제하는 대신,
            // 기존 컬렉션을 클리어한 후 새로운 Photo들을 추가하는 방식으로 처리
            if (playlist.getPhotos() == null) {
                // 컬렉션이 null인 경우, 새 리스트 생성 후 할당
                playlist.setPhotos(new ArrayList<>());
            } else {
                // 컬렉션이 이미 있다면 클리어
                playlist.getPhotos().clear();
            }
            
            // 새로운 Photo 엔티티 생성
            List<Photo> newPhotos = newPhotoUrls.stream()
                    .map(url -> new Photo(playlist, url))
                    .collect(Collectors.toList());
            
            // 기존 컬렉션에 새 Photo들을 추가
            playlist.getPhotos().addAll(newPhotos);
        }

        
        playlistRepository.save(playlist);  

        return playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalStateException("Failed to fetch updated playlist"));
    }
    @Transactional
    public void deletePlaylist(int playlistId) {
        if (!playlistRepository.existsById(playlistId)) {
            throw new IllegalArgumentException("존재하지 않는 Playlist입니다.");
        }

        // 1️⃣ Photo 삭제
        photoRepository.deleteByPlaylist_PlaylistId(playlistId);

        // 2️⃣ Playlist 삭제
        playlistRepository.deleteById(playlistId);
    }
}

