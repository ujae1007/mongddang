package com.mongddang.backend.photo.repository;

import com.mongddang.backend.photo.entity.Photo;
import com.mongddang.backend.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Integer> {
    List<Photo> findByPlaylist(Playlist playlist);  // ✅ Playlist 기준으로 Photo 조회
}
