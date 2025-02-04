package com.mongddang.backend.album.repository;

import com.mongddang.backend.album.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
    // JPA가 기본적인 CRUD 메서드를 자동으로 제공함!
}