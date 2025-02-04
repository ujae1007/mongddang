package com.mongddang.backend.playlist.controller;

import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.playlist.service.PlaylistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping("/{albumId}")
    public ResponseEntity<Playlist> createPlaylist(@PathVariable("albumId") int albumId) {
        return ResponseEntity.ok(playlistService.createPlaylist(albumId));
    }
    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistDto> updatePlaylist(@PathVariable("playlistId") int playlistId, @RequestBody PlaylistDto dto) {
        Playlist updatedPlaylist = playlistService.updatePlaylist(playlistId, dto);
        return ResponseEntity.ok(new PlaylistDto(updatedPlaylist)); // 🚀 DTO로 변환 후 반환
    }
    @DeleteMapping("/{playlistId}")
    public ResponseEntity<String> deletePlaylist(@PathVariable("playlistId") int playlistId) {
        playlistService.deletePlaylist(playlistId);
        return ResponseEntity.ok("Playlist 삭제 완료");
    }
}


