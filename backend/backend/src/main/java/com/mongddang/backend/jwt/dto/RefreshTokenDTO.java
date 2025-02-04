package com.mongddang.backend.jwt.dto;

import java.util.Date;

public class RefreshTokenDTO {
	
	private int refreshTokenId;
	private String email;
	private String token;
	private Date createdAt;
	private Date expiredAt;
	public int getRefreshTokenId() {
		return refreshTokenId;
	}
	public void setRefreshTokenId(int refreshTokenId) {
		this.refreshTokenId = refreshTokenId;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public Date getExpiredAt() {
		return expiredAt;
	}
	public void setExpiredAt(Date expiredAt) {
		this.expiredAt = expiredAt;
	}
	
	
}
