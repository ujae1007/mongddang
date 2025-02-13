package com.mongddang.backend.photo.repository;

import com.mongddang.backend.photo.entity.Photo;
import com.mongddang.backend.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Integer> {
    // Playlist 기준으로 Photo 목록 조회
    List<Photo> findByPlaylist(Playlist playlist);

    @Modifying
    @Query("delete from Photo p where p.playlist.playlistId = :playlistId")
    void deleteByPlaylist_PlaylistId(@Param("playlistId") int playlistId);
}
