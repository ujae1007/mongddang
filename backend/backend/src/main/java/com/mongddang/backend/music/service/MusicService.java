package com.mongddang.backend.music.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mongddang.backend.music.dto.MusicDetailDto;
import com.mongddang.backend.music.entity.Music;
import com.mongddang.backend.music.repository.MusicRepository;

@Service
public class MusicService {
    private final MusicRepository musicRepository;

    public MusicService(MusicRepository musicRepository) {
        this.musicRepository = musicRepository;
    }

    // ✅ 실시간 자동완성 검색
    public List<MusicDetailDto> autocompleteMusic(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>(); // 검색어 없으면 빈 리스트 반환
        }

        // 트랙명 또는 아티스트명에서 검색어 포함된 음악 조회
        List<Music> musicList = musicRepository.findTop10ByTrackNameContainingOrArtistNameContaining(query, query);

        // DTO 변환 후 반환
        return musicList.stream()
                .map(music -> new MusicDetailDto(
                        music.getMusicId(),
                        music.getTrackName(),
                        music.getArtistName(),
                        music.getGenre(),
                        music.getPopularity()))
                .collect(Collectors.toList());
    }
}
