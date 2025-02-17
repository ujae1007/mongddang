package com.mongddang.backend.album.repository;

import com.mongddang.backend.album.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // ✅ JPA Repository로 변경
public interface MyLikeRepository extends JpaRepository<Like, Integer> {
    // ✅ JPA 메서드 제공 (MyBatis 필요 없음)
    boolean existsByUserIdAndAlbumId(int userId, int albumId);
}
