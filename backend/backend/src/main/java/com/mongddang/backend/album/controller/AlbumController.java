package com.mongddang.backend.album.controller;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.service.AlbumService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

import java.security.Principal;

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
}
