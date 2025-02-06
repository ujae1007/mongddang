package com.mongddang.backend.jwt.service;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


@Service
public class RedisService {
	
	private final RedisTemplate<String, Object> redisTemplate;
	
    public RedisService(RedisTemplate<String, Object> redisTemplate) {
	        this.redisTemplate = redisTemplate;
	}
    
    
    // refreshToken 저장
    public void saveRefreshToken(String refreshToken, String email, long ttlMillis) {
        String key = refreshToken;
        redisTemplate.opsForValue().set(key, email, ttlMillis, TimeUnit.MILLISECONDS);
    }
    
    // Refresh Token으로 사용자 ID 조회
    public String getEmailByRefreshToken(String refreshToken) {
        String key = refreshToken;
        Object value = redisTemplate.opsForValue().get(key);  // 없거나 만료된 경우 null
        return (value != null) ? (String) value : null;
    }
    
    // refresh 토큰 삭제
    public void deleteRefreshToken(String refreshToken) {
        String key = refreshToken;
        redisTemplate.delete(key); // 키 삭제
    }
    
    
    
}
