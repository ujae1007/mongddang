package com.mongddang.backend.profile.repository;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.mongddang.backend.profile.dto.ProfileResponseDTO;
import com.mongddang.backend.profile.dto.ProfileSummaryResponseDTO;

public interface ProfileRepository {
	ProfileResponseDTO afterLoginProfile(int userId);
	
	ProfileSummaryResponseDTO getProfileByUserId(@Param("userId") int userId, @Param("loginUserId") int loginUserId);

}
