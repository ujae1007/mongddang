package com.mongddang.backend.album.repository;

import com.mongddang.backend.album.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
    // JPA가 기본적인 CRUD 메서드를 자동으로 제공함!
    // ✅ 모든 공개된 앨범 조회 (status = true)
    List<Album> findByStatus(boolean status);

    // ✅ 특정 사용자의 모든 앨범 조회
    List<Album> findByUserId(int userId);

    // ✅ 특정 사용자의 공개된 앨범 조회 (status = true)
    List<Album> findByUserIdAndStatus(int userId, boolean status);
}