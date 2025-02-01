package com.mongddang.backend.jwt;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.mongddang.backend.jwt.service.RedisService;


import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
	
	private final AuthenticationManager authenticationManager;
	private final JWTUtil jwtUtil;
	private final RedisService redisService;
	
	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RedisService redisService) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.redisService = redisService;
		setFilterProcessesUrl("/api/auth/login");
	}
	
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest requset, HttpServletResponse response) throws AuthenticationException {
		
		
		// 클라이언트 요청에서 username, password 꺼내기
		String email = obtainUsername(requset);
		String password = obtainPassword(requset);
		
//		System.out.println(email);
		
		//스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);

				//token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
		
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
		redisService.saveRefreshToken(refreshToken, email, ttlMillis);
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
