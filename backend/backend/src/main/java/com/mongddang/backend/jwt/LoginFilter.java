package com.mongddang.backend.jwt;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.mongddang.backend.user.dto.CustomUserDetailsDTO;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
	
	private final AuthenticationManager authenticationManager;
	private final JWTUtil jwtUtil;
	
	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		
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
		CustomUserDetailsDTO customUserDetailsDTO = (CustomUserDetailsDTO)authentication.getPrincipal();
		
		String email = customUserDetailsDTO.getUsername();
		String token = jwtUtil.createJwt(email);
		
		response.addHeader("Authorization", "Baearer " + token);
    }
	
	//로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
    	response.setStatus(401);
    }
}
