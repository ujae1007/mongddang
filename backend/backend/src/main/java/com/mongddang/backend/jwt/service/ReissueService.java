package com.mongddang.backend.jwt.service;

import org.springframework.stereotype.Service;

import com.mongddang.backend.jwt.JWTUtil;
import com.mongddang.backend.jwt.dto.ReissueResponseDTO;


@Service
public class ReissueService {
	
	private final RefreshTokenService refreshTokenService;
	private final JWTUtil jwtUtil;
	
	public ReissueService(RefreshTokenService refreshTokenService, JWTUtil jwtUtil) {
		this.refreshTokenService = refreshTokenService;
		this.jwtUtil = jwtUtil;
	}
	
	
	public ReissueResponseDTO reissue(String refreshToken) {
		// JWTUtil에서 "category" 체크 (선택)
        String category = jwtUtil.getCategory(refreshToken);
        if (!"refresh".equals(category)) {
            return null; 
        }
        
		// refreshtoken이 유효한지 확인
		String email = refreshTokenService.getEmailByRefreshToken(refreshToken);
		if(email == null) {
			return null;
		}
		
		refreshTokenService.deleteRefreshToken(refreshToken);
		
		// 새로운 access token과 refresh token 생성
		String newAccessToken = jwtUtil.createAccessToken("access", email);
		String newRefreshToken = jwtUtil.createRefreshToken("refresh", email);
		
		// 새로운 refreshToken  저장
		refreshTokenService.saveRefreshToken(newRefreshToken, email, jwtUtil.getRefreshTokenExpirationTime());
		
		ReissueResponseDTO reissueResponseDTO = new ReissueResponseDTO();
		reissueResponseDTO.setNewAccessToken(newAccessToken);
		reissueResponseDTO.setNewRefreshToken(newRefreshToken);
		return reissueResponseDTO;
		
	}
}
