package com.mongddang.backend.user.repository;

import com.mongddang.backend.user.dto.UserDTO;

public interface UserRepository {
	
	// 회원가입
	public int insertUser(UserDTO userDTO);
	
	// 이메일 존재 여부 확인
    public int existsByEmail(String email);
    
    // 이메일로 사용자 정보 조회
    public UserDTO getUserByEmail(String email);

}
