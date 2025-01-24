package com.mongddang.backend.user.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.entity.User;
import com.mongddang.backend.user.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}
	
	// 회원가입
	public boolean signUp(UserDTO userDTO) throws Exception {
		int cnt = userRepository.existsByEmail(userDTO.getEmail());
		if (cnt >= 1) {
			throw new Exception("이미 사용 중인 이메일입니다.");
		} 
		// 2. 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);
        return userRepository.insertUser(userDTO) == 1;
	}
}
