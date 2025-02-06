package com.mongddang.backend.jwt;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongddang.backend.jwt.dto.LoginDTO;
import com.mongddang.backend.jwt.service.RedisService;
import com.mongddang.backend.jwt.service.RefreshTokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
	
	private final AuthenticationManager authenticationManager;
	private final JWTUtil jwtUtil;
	private final RefreshTokenService refreshTokenService;
	
	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.refreshTokenService = refreshTokenService;
		setFilterProcessesUrl("/api/auth/login");
	}
	
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
		
		// 요청 확인
		if (request.getContentType() != null && request.getContentType().startsWith("application/json")) {
			try {
				// Json 데이터 파싱
				ObjectMapper objectMapper = new ObjectMapper();
				LoginDTO loginDTO = objectMapper.readValue(request.getInputStream(), LoginDTO.class);
				String email = loginDTO.getEmail();
				String password = loginDTO.getPassword();
				//token에 담은 검증을 위한 AuthenticationManager로 전달
		        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);
		        return authenticationManager.authenticate(authToken);
			} catch (IOException e) {
	            throw new AuthenticationServiceException("JSON 파싱에 실패했습니다.", e);
	        }
	    } else {
	        // JSON이 아닌 경우 기존 방식(form-data)으로 처리
	        String email = obtainUsername(request);
	        String password = obtainPassword(request);
	        
	        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);
	        setDetails(request, authToken);
	        return authenticationManager.authenticate(authToken);
	    }		
}
	
	// 로그인 성공시 jwt 토큰을 위해 실행하는 메소드
	@Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
		// 사용자 정보 가져오기
		String email = authentication.getName();
		// JWT 에서 refreshToken 만료시간 가져오기
		long ttlMillis = jwtUtil.getRefreshTokenExpirationTime();
		// access token 생성
		String accessToken = jwtUtil.createAccessToken("access",email);
		// refresh token 생성
		String refreshToken = jwtUtil.createRefreshToken("refresh", email);
		
		
		response.addHeader("Authorization", "Bearer " + accessToken);
		response.addCookie(createCookie("refresh", refreshToken));
		response.setStatus(HttpStatus.OK.value());
		refreshTokenService.saveRefreshToken(refreshToken, email, ttlMillis);
    }
	
	//로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
    	response.setStatus(401);
    }
    
    
    
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 60 * 24);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
