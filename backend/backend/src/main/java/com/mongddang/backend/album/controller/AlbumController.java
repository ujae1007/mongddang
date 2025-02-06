package com.mongddang.backend.album.controller;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.service.AlbumService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    private final AlbumService albumService;
    private final UserService userService;

    public AlbumController(AlbumService albumService, UserService userService) {
        this.albumService = albumService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<AlbumResponseDto> createAlbum(Principal principal, @RequestBody AlbumRequestDto albumRequestDto) {
    	String email = principal.getName();
    	// email로 받고
    	UserDTO userDTO = userService.getUserByEmail(email);
    	// 해당 email을 통해 db에서 해당 user_id 찾기
    	int userId = userDTO.getUserId();
    	
        AlbumResponseDto createdAlbum = albumService.createAlbum(albumRequestDto, userId);
        return ResponseEntity.ok(createdAlbum);
    }
    
    @DeleteMapping("/{albumId}")
    public ResponseEntity<String> deleteAlbum(@PathVariable("albumId") int albumId) {
        albumService.deleteAlbum(albumId);
        return ResponseEntity.ok("Album 삭제 완료");
    }
    
    // ✅ 모든 사용자의 공개된 앨범 조회 (Playlist 정보 제외)
    @GetMapping("")
    public ResponseEntity<List<AlbumResponseDto>> getAllPublicAlbums() {
        List<AlbumResponseDto> albums = albumService.getAllPublicAlbums();
        return ResponseEntity.ok(albums);
    }

    // ✅ 내 앨범 조회 (Playlist 정보 제외)
    @GetMapping("/my")
    public ResponseEntity<List<AlbumResponseDto>> getMyAlbums(Principal principal) {
        List<AlbumResponseDto> myAlbums = albumService.getMyAlbums(principal);
        return ResponseEntity.ok(myAlbums);
    }

    // ✅ 특정 사용자의 공개된 앨범 조회 (Playlist 정보 제외)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AlbumResponseDto>> getUserPublicAlbums(@PathVariable("userId") int userId) {
        List<AlbumResponseDto> publicAlbums = albumService.getUserPublicAlbums(userId);
        return ResponseEntity.ok(publicAlbums);
    }

    // ✅ 특정 앨범 상세 조회 (Playlist 정보 포함)
    @GetMapping("/{albumId}")
    public ResponseEntity<AlbumResponseDto> getAlbum(@PathVariable("albumId") int albumId) {
        AlbumResponseDto albumResponse = albumService.getAlbumById(albumId);
        return ResponseEntity.ok(albumResponse);
    }
    
}
