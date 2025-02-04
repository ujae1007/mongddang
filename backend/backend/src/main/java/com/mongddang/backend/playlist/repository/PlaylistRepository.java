package com.mongddang.backend.playlist.repository;

import com.mongddang.backend.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    
    // Album의 albumId를 기준으로 해당 Playlist 목록을 조회
    List<Playlist> findByAlbum_AlbumId(int albumId);
    
    // Album의 albumId를 기준으로 해당 Playlist들을 삭제 (삭제 쿼리는 @Modifying과 @Query를 사용)
    @Modifying
    @Query("delete from Playlist p where p.album.albumId = :albumId")
    void deleteByAlbum_AlbumId(@Param("albumId") int albumId);
}


//package com.mongddang.backend.playlist.repository;
//
//import com.mongddang.backend.playlist.entity.Playlist;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
//}
