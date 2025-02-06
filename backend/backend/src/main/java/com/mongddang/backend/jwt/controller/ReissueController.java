package com.mongddang.backend.jwt.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.jwt.dto.ReissueResponseDTO;
import com.mongddang.backend.jwt.service.ReissueService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class ReissueController {
	
	private final ReissueService reissueService;
	
	public ReissueController(ReissueService reissueService) {
		this.reissueService = reissueService;
	}
	
	@PostMapping("/reissue")
	public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
		// cookie에서 refresh token 찾기
		String refreshToken = null;
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("refresh")) {
				refreshToken = cookie.getValue();
			}
		}
		
		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("refresh token이 없습니다.");
		}
		
		ReissueResponseDTO reissueResponseDTO = reissueService.reissue(refreshToken);
		
		if (reissueResponseDTO == null) {
			// null이면 "유효하지 않거나 만료된 토큰"
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Refresh token이 유효하지 않거나 만료됐음");
		}
		
		response.setHeader("Authorization", "Bearer " + reissueResponseDTO.getNewAccessToken());
		response.addCookie(createCookie("refresh",reissueResponseDTO.getNewRefreshToken()));
		
		// 4) 응답 반환
        return ResponseEntity.ok("재발급 성공");
	}
	private Cookie createCookie(String key, String value) {
	
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
	    cookie.setHttpOnly(true);
	
	    return cookie;
	}
}
