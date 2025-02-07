package com.mongddang.backend.music.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.music.dto.MusicDetailDto;
import com.mongddang.backend.music.service.MusicService;

@RestController
@RequestMapping("/api/music")
public class MusicController {
    private final MusicService musicService;

    public MusicController(MusicService musicService) {
        this.musicService = musicService;
    }

    // ✅ 실시간 음악 검색 API (자동완성 지원)
    @GetMapping("/autocomplete")
    public ResponseEntity<List<MusicDetailDto>> autocompleteMusic(
            @RequestParam(value = "query", required = false) String query) {
        List<MusicDetailDto> musicList = musicService.autocompleteMusic(query);
        return ResponseEntity.ok(musicList);
    }
}
