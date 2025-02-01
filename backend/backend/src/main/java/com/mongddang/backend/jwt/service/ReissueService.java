package com.mongddang.backend.jwt.service;

import org.springframework.stereotype.Service;

import com.mongddang.backend.jwt.JWTUtil;
import com.mongddang.backend.jwt.dto.ReissueResponseDTO;

@Service
public class ReissueService {
	
	private final RedisService redisService;
	private final JWTUtil jwtUtil;
	
	public ReissueService(RedisService redisService, JWTUtil jwtUtil) {
		this.redisService = redisService;
		this.jwtUtil = jwtUtil;
	}
	
	
	public ReissueResponseDTO reissue(String refreshToken) {
		// JWTUtil에서 "category" 체크 (선택)
        String category = jwtUtil.getCategory(refreshToken);
        if (!"refresh".equals(category)) {
            return null; 
        }
        
		// redis에서 refreshtoken이 유효한지 확인
		String email = redisService.getEmailByRefreshToken(refreshToken);
		if(email == null) {
			return null;
		}
		
		redisService.deleteRefreshToken(refreshToken);
		
		// 새로운 access token과 refresh token 생성
		String newAccessToken = jwtUtil.createAccessToken("access", email);
		String newRefreshToken = jwtUtil.createRefreshToken("refresh", email);
		
		// 새로운 refreshToken redis에 저장
		redisService.saveRefreshToken(newRefreshToken, email, jwtUtil.getRefreshTokenExpirationTime());
		
		ReissueResponseDTO reissueResponseDTO = new ReissueResponseDTO();
		reissueResponseDTO.setNewAccessToken(newAccessToken);
		reissueResponseDTO.setNewRefreshToken(newRefreshToken);
		return reissueResponseDTO;
		
	}
}
