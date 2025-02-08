package com.mongddang.backend.like.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.like.dto.LikeAlbumResponseDTO;
import com.mongddang.backend.like.service.LikeService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

@RestController
@RequestMapping("/api/like")
public class LikeController {
	private final LikeService likeService;
	private final UserService userSerivce;
	
	public LikeController(LikeService likeService, UserService userService) {
		this.likeService = likeService;
		this.userSerivce = userService;
	}
	
	
	// 좋아요 생성
	@PostMapping("/{albumId}")
	public ResponseEntity<?> addLike(@PathVariable("albumId") int albumId, Principal principal){
		try {
			String currentUserEmail = principal.getName();
			UserDTO userDTO = userSerivce.getUserByEmail(currentUserEmail);
			int userId = userDTO.getUserId();
			boolean likeStatus = likeService.isAlreadyLike(userId, albumId);
			// 만약 이미 좋아요 상태라면
			if(likeStatus) {
				return ResponseEntity.badRequest().body("이미 좋아요 상태입니다.");
			}
			
			boolean result = likeService.addLike(albumId, userId);
			if(result) {
				return ResponseEntity.status(HttpStatus.CREATED).body("좋아요 완료");
			} else {
				return ResponseEntity.badRequest().body("좋아요 실패");
			}
			
			
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}	
	
	
	// 좋아요 삭제
	@DeleteMapping("/{albumId}")
	public ResponseEntity<?> deleteLike(@PathVariable("albumId") int albumId, Principal principal) {
		try {
			String currentUserEmail = principal.getName();
			UserDTO userDTO = userSerivce.getUserByEmail(currentUserEmail);
			int userId = userDTO.getUserId();
			
			boolean likeStatus = likeService.isAlreadyLike(userId, albumId);
			// 만약 좋아요 상태가 아니라면
			if(!likeStatus) {
				return ResponseEntity.badRequest().body("좋아요 상태가 아닙니다");
			}
			
			boolean result = likeService.deleteLike(albumId, userId);
			if(result) {
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body("좋아요 삭제완료");
			} else {
				return ResponseEntity.badRequest().body("좋아요 실패");
			}
			
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
	
	// 내가 좋아요 한 앨범 목록 조회
	@GetMapping("/albums")
	public ResponseEntity<?> LikeAlbumList(Principal principal) {
		try {
			String currentUserEmail = principal.getName();
			UserDTO userDTO = userSerivce.getUserByEmail(currentUserEmail);
			int userId = userDTO.getUserId();
			
			LikeAlbumResponseDTO LikeAlbumResponseDTO = likeService.getLikeAlbums(userId);
			return ResponseEntity.ok(LikeAlbumResponseDTO);
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
	
		
	
		
	
}
