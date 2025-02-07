package com.mongddang.backend.profile.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.profile.dto.ProfileResponseDTO;
import com.mongddang.backend.profile.dto.ProfileSummaryResponseDTO;
import com.mongddang.backend.profile.service.ProfileService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
	private final ProfileService profileService;
	private final UserService userService;
	
	public ProfileController(ProfileService profileService, UserService userService) {
		this.profileService = profileService;
		this.userService = userService;
	}
	
	@GetMapping("/afterlogin")
	public ResponseEntity<?> afterLoginProfile(Principal principal) {
		try {
			String currentUserEmail = principal.getName();
			UserDTO currentUser = userService.getUserByEmail(currentUserEmail);
			int userId = currentUser.getUserId();
			ProfileResponseDTO profileResponseDTO = profileService.afterLoginProfile(userId);
			if (profileResponseDTO == null || profileResponseDTO.getAlbums() == null || profileResponseDTO.getAlbums().isEmpty()) {
	            return ResponseEntity.ok("앨범이 없습니다. 앨범을 추가해주세요.");
	        }
	        return ResponseEntity.ok(profileResponseDTO);
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<?> getProfileByUserId(@PathVariable("userId") int userId, Principal principal) {
		try {
			String currentUserEmail = principal.getName();
			UserDTO currentUser = userService.getUserByEmail(currentUserEmail);
			int loginUserId = currentUser.getUserId();
			ProfileSummaryResponseDTO profileSummaryResponseDTO = profileService.getProfileByUserId(userId, loginUserId);
			return ResponseEntity.ok(profileSummaryResponseDTO);
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
}
