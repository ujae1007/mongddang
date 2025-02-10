package com.mongddang.backend.follow.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
	public ResponseEntity<?> doFollow(Principal pricipal, @PathVariable("followedId") int followedId) {		
		try {
			String currentUserEmail = pricipal.getName();
			UserDTO currentUserDTO = userService.getUserByEmail(currentUserEmail);
			int followingId = currentUserDTO.getUserId();
			
			// 팔로우 상태 확인 -> 이미 팔로우 상태면 true, 아니면 false 
			boolean followStatus = followService.isAlreadyFollow(followingId, followedId);	
			
			// 만약 이미 팔로우 상태라면
			if (followStatus) {
				return ResponseEntity.badRequest().body("이미 팔로우 상태입니다.");
	        } 
			
	        // 팔로우 상태 아님 => 팔로우 생성
            boolean result = followService.doFollow(followingId, followedId);
            if(result) {
            	return ResponseEntity.status(HttpStatus.CREATED).body("팔로우 완료");
            } else {
            	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팔로우 실패");
            }
        } catch (Exception e) {
        	return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
        }
	}
	
	
	
	// 팔로우 취소 
	@DeleteMapping("/{followedId}")
	public ResponseEntity<?> cancelFollow(Principal pricipal, @PathVariable("followedId") int followedId) {
		try {
			String currentUserEmail = pricipal.getName();
			UserDTO currentUserDTO = userService.getUserByEmail(currentUserEmail);
			int followingId = currentUserDTO.getUserId();
			
			// 팔로우 상태 확인 -> 이미 팔로우 상태면 true, 아니면 false 
			boolean followStatus = followService.isAlreadyFollow(followingId, followedId);	
			
			// 만약 팔로우 상태가 아니라면 
			if (!followStatus) {
				return ResponseEntity.badRequest().body("팔로우 상태가 아닙니다.");
	        } 
			
	        // 팔로우 상태 => 팔로우 취소
            boolean result = followService.deleteFollow(followingId, followedId);
            if(result) {
            	return ResponseEntity.status(HttpStatus.CREATED).body("팔로우 취소 완료");
            } else {
            	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("팔로우 취소 실패");
            }
        } catch (Exception e) {
        	return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
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
