package com.mongddang.backend.music.repository;

import com.mongddang.backend.music.entity.Music;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepository extends JpaRepository<Music, Integer> {
	
    // ✅ 실시간 자동완성 검색 (트랙명 or 아티스트명)
    List<Music> findTop10ByTrackNameContainingOrArtistNameContaining(String trackName, String artistName);
}	