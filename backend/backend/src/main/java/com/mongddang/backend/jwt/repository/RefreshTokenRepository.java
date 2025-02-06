package com.mongddang.backend.jwt.repository;

import com.mongddang.backend.jwt.dto.RefreshTokenDTO;

public interface RefreshTokenRepository {
	// refresh 토큰으로 사용자 조회
	public RefreshTokenDTO getEmailByRefreshToken(String refreshToken);

	
	// refresh token 저장
	public int saveRefreshToken(RefreshTokenDTO refreshTokenDTO);
	
	// refresh token 삭제
	public int deleteRefreshToken(String token);
	
	
}
