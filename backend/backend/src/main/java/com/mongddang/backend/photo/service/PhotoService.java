package com.mongddang.backend.photo.service;

import com.mongddang.backend.photo.entity.Photo;
import com.mongddang.backend.photo.repository.PhotoRepository;
import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.playlist.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final PlaylistRepository playlistRepository;

    private final String uploadDir = "uploads/photos/"; // 🚀 파일 저장 경로 (현재 로컬)

    public PhotoService(PhotoRepository photoRepository, PlaylistRepository playlistRepository) {
        this.photoRepository = photoRepository;
        this.playlistRepository = playlistRepository;
    }

    @Transactional
    public void addPhotos(int playlistId, List<MultipartFile> files) throws IOException {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId"));

        // 현재 등록된 사진 개수 확인
        List<Photo> existingPhotos = photoRepository.findByPlaylist(playlist);
        if (existingPhotos.size() + files.size() > 5) {
            throw new IllegalArgumentException("최대 5개의 사진만 등록 가능합니다.");
        }

        // 파일 저장 및 URL 생성
        for (MultipartFile file : files) {
            String filePath = uploadDir + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destFile = new File(filePath);
            file.transferTo(destFile);

            String photoUrl = "/photos/" + destFile.getName();  // 🚀 URL 저장 (현재 로컬 서버 방식)
            Photo photo = new Photo(playlist, photoUrl);
            photoRepository.save(photo);
        }
    }
}
