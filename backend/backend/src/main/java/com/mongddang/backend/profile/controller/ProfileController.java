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
	public ResponseEntity<?> getProfile(Principal principal) {
		try {
			String currentUserEmail = principal.getName();
			UserDTO currentUser = userService.getUserByEmail(currentUserEmail);
			int userId = currentUser.getUserId();
			List<ProfileResponseDTO> list = profileService.getProfile(userId);
			if (list == null || list.size()==0) {
				return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<List<ProfileResponseDTO>>(list, HttpStatus.OK);
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
}
