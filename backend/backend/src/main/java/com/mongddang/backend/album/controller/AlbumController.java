package com.mongddang.backend.album.controller;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.service.AlbumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @PostMapping("/create")
    public ResponseEntity<AlbumResponseDto> createAlbum(@RequestBody AlbumRequestDto albumRequestDto) {
        AlbumResponseDto createdAlbum = albumService.createAlbum(albumRequestDto);
        return ResponseEntity.ok(createdAlbum);
    }
    
    @DeleteMapping("/{albumId}")
    public ResponseEntity<String> deleteAlbum(@PathVariable("albumId") int albumId) {
        albumService.deleteAlbum(albumId);
        return ResponseEntity.ok("Album 삭제 완료");
    }
}
