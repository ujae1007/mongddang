package com.mongddang.backend.profile.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.profile.dto.ProfileResponseDTO;
import com.mongddang.backend.profile.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
	private final ProfileService profileService;
	
	public ProfileController(ProfileService profileService) {
		this.profileService = profileService;
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<?> getProfile(@PathVariable("userId") int userId) {
		try {
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
