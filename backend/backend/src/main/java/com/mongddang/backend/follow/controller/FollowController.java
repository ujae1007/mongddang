package com.mongddang.backend.follow.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

import com.mongddang.backend.follow.dto.FollowListDTO;
import com.mongddang.backend.follow.service.FollowService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
	
	private final FollowService followService;
	private final UserService userService;
	
	public FollowController(FollowService followService, UserService userService) {
		this.followService = followService;
		this.userService = userService;
	}
	
	// 팔로우 하기 (이미 팔로우 상태이면 팔로우 취소, 팔로우 상태가 아니면 팔로우 시도)
	@PostMapping("/{followedId}")
	public ResponseEntity<?> followUser(Principal pricipal, @PathVariable("followedId") int followedId) {		
		try {
			String currentUserEmail = pricipal.getName();
			UserDTO currentUserDTO = userService.getUserByEmail(currentUserEmail);
			
			int followingId = currentUserDTO.getUserId();
			boolean result = followService.isAlreadyFollow(followingId, followedId);	// 이미 팔로우 상태면 true, 아니면 false 
			String message;
			
			// 만약 이미 팔로우 상태라면
			if (result) {
	            // 이미 팔로우 상태 => 언팔
	            boolean deleted = followService.deleteFollow(followingId, followedId);
	            message = deleted ? "팔로우 취소 성공" : "팔로우 취소 실패";
	        } else {
	            // 팔로우 상태 아님 => 팔로우 생성
	            boolean inserted = followService.doFollow(followingId, followedId);
	            message = inserted ? "팔로우 성공" : "팔로우 생성 실패";
	        }
	        // 모든 분기를 지난 뒤 공통 return
	        return ResponseEntity.ok(message);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("서버 에러: " + e.getMessage());
			
		}
	
	}
	
	@GetMapping("/find-followingUsers/{userId}")
	public ResponseEntity<?> findFollowing(@PathVariable("userId") int userId) {
		try {
			List<FollowListDTO> followingList = followService.followingList(userId);
			return ResponseEntity.ok(followingList);
		} catch (Exception e) {
            return ResponseEntity.status(500).body("서버 에러: " + e.getMessage());
        }
	}
	
	@GetMapping("/find-followedUsers/{userId}")
	public ResponseEntity<?> findFollowed(@PathVariable("userId") int userId) {
		try {
			List<FollowListDTO> followedList = followService.followedList(userId);
			return ResponseEntity.ok(followedList);
		} catch (Exception e) {
            return ResponseEntity.status(500).body("서버 에러: " + e.getMessage());
        }
		
	}
}
