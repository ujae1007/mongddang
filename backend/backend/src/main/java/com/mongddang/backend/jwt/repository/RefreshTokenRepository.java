package com.mongddang.backend.jwt.repository;

import com.mongddang.backend.jwt.dto.RefreshTokenDTO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface RefreshTokenRepository {
	// refresh 토큰으로 사용자 조회
	public RefreshTokenDTO getEmailByRefreshToken(@Param("token") String refreshToken);

	
	// refresh token 저장
	public int saveRefreshToken(RefreshTokenDTO refreshTokenDTO);
	
	// refresh token 삭제
	public int deleteRefreshToken(@Param("token") String token);
	

	// 만료된 refresh token 삭제
    int deleteExpiredTokens();
}
