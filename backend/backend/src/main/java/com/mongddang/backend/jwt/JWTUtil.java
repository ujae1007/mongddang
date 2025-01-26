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
	private final long expirationTime;
	
	public JWTUtil(@Value("${spring.jwt.secret}") String secret, @Value("${spring.jwt.expiration}") long expirationTime) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
	}
	// 검증을 위한 메서드
	public String getEmail(String token) {
		
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("email", String.class);
    }
	
	public Boolean isExpired(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }
	
	 public String createJwt(String email) {

	        return Jwts.builder()
	                .claim("email", email)
	                .issuedAt(new Date(System.currentTimeMillis()))
	                .expiration(new Date(System.currentTimeMillis() + expirationTime))
	                .signWith(secretKey)
	                .compact();
	    }
	
	
}
