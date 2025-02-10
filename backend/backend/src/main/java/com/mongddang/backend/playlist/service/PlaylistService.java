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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.AccessDeniedException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

//추가 부분
import com.mongddang.backend.storage.service.S3StorageService;

@Service
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final AlbumRepository albumRepository;
    private final PhotoRepository photoRepository;
    // 추가부분
    private final S3StorageService s3StorageService;

    public PlaylistService(PlaylistRepository playlistRepository, AlbumRepository albumRepository, PhotoRepository photoRepository, S3StorageService s3StorageService) {
        this.playlistRepository = playlistRepository;
        this.albumRepository = albumRepository;
        this.photoRepository = photoRepository;
        this.s3StorageService = s3StorageService;
    }
    
    // 플레이리스트 생성 시, 해당 앨범의 소유자가 현재 사용자와 일치하는지 확인
    @Transactional
    public Playlist createPlaylist(int albumId, int currentUserId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid albumId"));
        // 앨범의 소유자가 현재 사용자와 다르면 권한 없음
        if (album.getUserId() != currentUserId) {
            throw new AccessDeniedException("권한이 없습니다.");
        }
        Playlist playlist = new Playlist(album);
        return playlistRepository.save(playlist);
    }
    
    // 플레이리스트 수정 시, 해당 플레이리스트가 속한 앨범의 소유자가 현재 사용자와 일치하는지 확인
    @Transactional
    public Playlist updatePlaylist(int playlistId, PlaylistDto dto, List<MultipartFile> files, int currentUserId) {
        Playlist playlist = playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId: " + playlistId));
        
        // 플레이리스트가 속한 앨범 정보 확인
        Album album = playlist.getAlbum();
        if (album.getUserId() != currentUserId) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        playlist.setStartTime(dto.getStartTime());
        playlist.setEndTime(dto.getEndTime());
        playlist.setLatitude(dto.getLatitude());
        playlist.setLongitude(dto.getLongitude());
        playlist.setLocationAddress(dto.getLocationAddress());
        playlist.setMusicId(dto.getMusicId());

        // 사진 업로드 처리: 파일이 있을 경우 S3에 업로드 후 URL 저장
        if (files != null && !files.isEmpty()) {
            List<String> newPhotoUrls = files.stream()
                    .limit(5) // 최대 5장 제한
                    .map(file -> {
                        try {
                            return s3StorageService.uploadFile(file, "playlist");
                        } catch (IOException e) {
                            throw new RuntimeException("사진 업로드 중 오류 발생", e);
                        }
                    })
                    .collect(Collectors.toList());

            // 기존 사진 제거 후 새 사진 등록
            if (playlist.getPhotos() == null) {
                playlist.setPhotos(new ArrayList<>());
            } else {
                playlist.getPhotos().clear();
            }

            List<Photo> newPhotos = newPhotoUrls.stream()
                    .map(url -> new Photo(playlist, url))
                    .collect(Collectors.toList());

            playlist.getPhotos().addAll(newPhotos);
        }

        playlistRepository.save(playlist);

        return playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalStateException("Failed to fetch updated playlist"));
    }

    // 플레이리스트 삭제 시, 해당 플레이리스트가 속한 앨범의 소유자가 현재 사용자와 일치하는지 확인
    @Transactional
    public void deletePlaylist(int playlistId, int currentUserId) {
        Playlist playlist = playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Playlist입니다."));
        
        // 플레이리스트가 속한 앨범의 소유자 확인
        Album album = playlist.getAlbum();
        if (album.getUserId() != currentUserId) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        // 1️⃣ Photo 삭제
        photoRepository.deleteByPlaylist_PlaylistId(playlistId);

        // 2️⃣ Playlist 삭제
        playlistRepository.deleteById(playlistId);
    }

}
