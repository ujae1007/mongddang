package com.mongddang.backend.jwt;

import java.nio.charset.StandardCharsets;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {
	private final SecretKey secretKey;
	private final long accessTokenExpirationTime;
	private final long refreshTokenExpirationTime;
	
	public JWTUtil(@Value("${spring.jwt.secret}") String secret, 
					@Value("${spring.jwt.access-expiration}") long accessTokenExpirationTime,
					@Value("${spring.jwt.refresh-expiration}") long refreshTokenExpirationTime) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationTime = accessTokenExpirationTime;
        this.refreshTokenExpirationTime = refreshTokenExpirationTime;
	}
	
	// 검증을 위한 메서드
	public String getEmail(String token) {
		
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email", String.class);
    }
	
	public String getCategory(String token) {
	      
	    return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
	}
	
	public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }
	
	// 만료시간 정보 가져오기
	public long getRefreshTokenExpirationTime() {
	    return refreshTokenExpirationTime;
	}
	
	
	 public String createAccessToken(String category, String email) {

	        return Jwts.builder()
	        		.claim("category", category)
	                .claim("email", email)
	                .issuedAt(new Date(System.currentTimeMillis()))
	                .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationTime))
	                .signWith(secretKey)
	                .compact();
	 }
	 
	 public	String createRefreshToken(String category, String email) {
		 
		 return Jwts.builder()
	        		.claim("category", category)
	                .claim("email", email)
	                .issuedAt(new Date(System.currentTimeMillis()))
	                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpirationTime))
	                .signWith(secretKey)
	                .compact();
	 }
	
	
}
