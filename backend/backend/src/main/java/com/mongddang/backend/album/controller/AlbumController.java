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
}


//import com.mongddang.backend.album.dto.AlbumResponseDto;
//import com.mongddang.backend.album.service.AlbumService;
////import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;

//import java.util.List;
//
//@RestController
//@RequestMapping("/api/albums")
////@RequiredArgsConstructor
//public class AlbumController {
//
//    private final AlbumService albumService;
//
//    public AlbumController(AlbumService albumService) {
//        this.albumService = albumService;
//    }
//
//    /** MyBatis CRUD **/
//    @GetMapping("/mybatis")
//    public ResponseEntity<List<AlbumResponseDto>> getAllAlbumsMyBatis() {
//        return ResponseEntity.ok(albumService.getAllAlbumsMyBatis());
//    }
//
//    @GetMapping("/mybatis/{albumId}")
//    public ResponseEntity<AlbumResponseDto> getAlbumByIdMyBatis(@PathVariable int albumId) {
//        return ResponseEntity.ok(albumService.getAlbumByIdMyBatis(albumId));
//    }
//
//    @PostMapping("/mybatis")
//    public ResponseEntity<String> createAlbumMyBatis(@RequestBody AlbumResponseDto dto) {
//        albumService.createAlbumMyBatis(dto);
//        return ResponseEntity.ok("Album created (MyBatis)");
//    }
//
//    @PutMapping("/mybatis/{albumId}")
//    public ResponseEntity<String> updateAlbumMyBatis(@PathVariable int albumId, @RequestBody AlbumResponseDto dto) {
//        dto.setAlbumId(albumId);
//        albumService.updateAlbumMyBatis(dto);
//        return ResponseEntity.ok("Album updated (MyBatis)");
//    }
//
//    @DeleteMapping("/mybatis/{albumId}")
//    public ResponseEntity<String> deleteAlbumMyBatis(@PathVariable int albumId) {
//        albumService.deleteAlbumMyBatis(albumId);
//        return ResponseEntity.ok("Album deleted (MyBatis)");
//    }
//
//    /** JPA CRUD **/
//    @GetMapping("/jpa/{albumId}")
//    public ResponseEntity<AlbumResponseDto> getAlbumByIdJpa(@PathVariable int albumId) {
//        AlbumResponseDto dto = albumService.getAlbumByIdJpa(albumId);
//        if (dto == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(dto);
//    }
//
//    @PostMapping("/jpa")
//    public ResponseEntity<String> createAlbumJpa(@RequestBody AlbumResponseDto dto) {
//        albumService.createAlbumJpa(dto);
//        return ResponseEntity.ok("Album created (JPA)");
//    }
//
//    @PutMapping("/jpa/{albumId}")
//    public ResponseEntity<String> updateAlbumJpa(@PathVariable int albumId, @RequestBody AlbumResponseDto dto) {
//        dto.setAlbumId(albumId);
//        albumService.updateAlbumJpa(dto);
//        return ResponseEntity.ok("Album updated (JPA)");
//    }
//
//    @DeleteMapping("/jpa/{albumId}")
//    public ResponseEntity<String> deleteAlbumJpa(@PathVariable int albumId) {
//        albumService.deleteAlbumJpa(albumId);
//        return ResponseEntity.ok("Album deleted (JPA)");
//    }
//}