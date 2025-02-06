package com.mongddang.backend.profile.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mongddang.backend.profile.dto.ProfileResponseDTO;
import com.mongddang.backend.profile.repository.ProfileRepository;

@Service
public class ProfileService {
	private final ProfileRepository profileRepository;
	
	public ProfileService(ProfileRepository profileRepository) {
		this.profileRepository = profileRepository;
	}
	
	 public List<ProfileResponseDTO> getProfile(int userId) {
	        return profileRepository.getProfile(userId);
	    }
}
