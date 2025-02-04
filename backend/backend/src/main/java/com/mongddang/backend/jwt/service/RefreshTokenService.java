package com.mongddang.backend.jwt.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.mongddang.backend.jwt.JWTUtil;
import com.mongddang.backend.jwt.dto.RefreshTokenDTO;
import com.mongddang.backend.jwt.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {
	private final RefreshTokenRepository refreshTokenRepository;
	private final JWTUtil jwtUtil;
	
	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JWTUtil jwtUtil) {
		this.refreshTokenRepository = refreshTokenRepository;
		this.jwtUtil = jwtUtil;
	}
	
	// refreshToken 저장
	public void saveRefreshToken(String refreshToken, String email, long ttlMillis) {
		RefreshTokenDTO refreshTokenDTO = new RefreshTokenDTO();
		
		refreshTokenDTO.setEmail(email);
		refreshTokenDTO.setToken(refreshToken);
		refreshTokenDTO.setExpiredAt(new Date(System.currentTimeMillis() + ttlMillis));
		
		refreshTokenRepository.saveRefreshToken(refreshTokenDTO);
	}
	
	// refreshToken으로 email 조회
	public String getEmailByRefreshToken(String refreshToken) {
		RefreshTokenDTO refreshTokenDTO = refreshTokenRepository.getEmailByRefreshToken(refreshToken);
		if (refreshTokenDTO == null) {
			return null;
		}
		// 만약 expired_at이 현재보다 이전이면, 토큰 만료로 간주.
		if(refreshTokenDTO.getExpiredAt().before(new Date())) {
			refreshTokenRepository.deleteRefreshToken(refreshToken);
			return null;
		}
		return refreshTokenDTO.getEmail();
	}
	
	
	// token 삭제
	public void deleteRefreshToken(String refreshToken) {
		refreshTokenRepository.deleteRefreshToken(refreshToken);
	}
	
	
}
