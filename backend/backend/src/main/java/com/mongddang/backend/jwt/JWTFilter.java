package com.mongddang.backend.jwt;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mongddang.backend.user.dto.CustomUserDetailsDTO;
import com.mongddang.backend.user.dto.UserDTO;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTFilter extends OncePerRequestFilter{
	private final JWTUtil jwtUtil;
	
	public JWTFilter(JWTUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		//request에서 Authorization 헤더에서 accessToken 찾음
        String accessToken= request.getHeader("Authorization");
        
        // accessToken 검증
        if (accessToken == null || !accessToken.startsWith("Bearer")) {
//        	System.out.println("token null");
        	filterChain.doFilter(request, response);
        	
        	return;
        }
        String token = accessToken.split(" ")[1];
        
        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        // Access token인지 refresh 토큰인지 확인
        String category = jwtUtil.getCategory(token);
        
        if (!category.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        String email = jwtUtil.getEmail(token);
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(email);
        userDTO.setPassword("temppassword");
        
        //UserDetails에 회원 정보 객체 담기
        CustomUserDetailsDTO customUserDetailsDTO = new CustomUserDetailsDTO(userDTO);
        
        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetailsDTO, null, customUserDetailsDTO.getAuthorities());
        
      //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);
        
        filterChain.doFilter(request, response);

		
	}
	
}
