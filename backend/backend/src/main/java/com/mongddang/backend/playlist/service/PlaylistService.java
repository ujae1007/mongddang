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

    @Transactional
    public Playlist createPlaylist(int albumId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid albumId"));
        Playlist playlist = new Playlist(album);
        return playlistRepository.save(playlist);
    }
    
    // 추가 부분
    @Transactional
    public Playlist updatePlaylist(int playlistId, PlaylistDto dto, List<MultipartFile> files) {
        Playlist playlist = playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId: " + playlistId));

        playlist.setStartTime(dto.getStartTime());
        playlist.setEndTime(dto.getEndTime());
        playlist.setLatitude(dto.getLatitude());
        playlist.setLongitude(dto.getLongitude());
        playlist.setLocationAddress(dto.getLocationAddress());
        playlist.setMusicId(dto.getMusicId());

        // ✅ 사진이 업로드되었을 경우 S3에 저장 후 URL 받아서 저장
        if (files != null && !files.isEmpty()) {
            List<String> newPhotoUrls = files.stream()
                    .limit(5) // ✅ 최대 5장 제한
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
//    @Transactional
//    public Playlist updatePlaylist(int playlistId, PlaylistDto dto) {
//        Playlist playlist = playlistRepository.findById(playlistId)
//            .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId: " + playlistId));
//
//        playlist.setStartTime(dto.getStartTime());
//        playlist.setEndTime(dto.getEndTime());
//        playlist.setLatitude(dto.getLatitude());
//        playlist.setLongitude(dto.getLongitude());
//        playlist.setLocationAddress(dto.getLocationAddress());
//        playlist.setMusicId(dto.getMusicId());  // ✅ musicId만 저장하도록 변경
//
//        if (dto.getPhotoUrls() != null) {
//            // 최대 5개 제한 (새롭게 들어온 Photo URL 목록에서 최대 5개만 사용)
//            List<String> newPhotoUrls = dto.getPhotoUrls().stream().limit(5).collect(Collectors.toList());
//            
//            // 기존 Playlist에 연결된 Photo들을 삭제하는 대신,
//            // 기존 컬렉션을 클리어한 후 새로운 Photo들을 추가하는 방식으로 처리
//            if (playlist.getPhotos() == null) {
//                // 컬렉션이 null인 경우, 새 리스트 생성 후 할당
//                playlist.setPhotos(new ArrayList<>());
//            } else {
//                // 컬렉션이 이미 있다면 클리어
//                playlist.getPhotos().clear();
//            }
//            
//            // 새로운 Photo 엔티티 생성
//            List<Photo> newPhotos = newPhotoUrls.stream()
//                    .map(url -> new Photo(playlist, url))
//                    .collect(Collectors.toList());
//            
//            // 기존 컬렉션에 새 Photo들을 추가
//            playlist.getPhotos().addAll(newPhotos);
//        }
//
//        
//        playlistRepository.save(playlist);  
//
//        return playlistRepository.findById(playlistId)
//            .orElseThrow(() -> new IllegalStateException("Failed to fetch updated playlist"));
//    }
    
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
