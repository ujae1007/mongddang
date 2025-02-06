package com.mongddang.backend.profile.repository;

import java.util.List;

import com.mongddang.backend.profile.dto.ProfileResponseDTO;

public interface ProfileRepository {
	List<ProfileResponseDTO> getProfile(int userId);

}
