package com.mongddang.backend.jwt.dto;

public class ReissueResponseDTO {
	private String newAccessToken;
	private String newRefreshToken;
	public String getNewAccessToken() {
		return newAccessToken;
	}
	public void setNewAccessToken(String newAccessToken) {
		this.newAccessToken = newAccessToken;
	}
	public String getNewRefreshToken() {
		return newRefreshToken;
	}
	public void setNewRefreshToken(String newRefreshToken) {
		this.newRefreshToken = newRefreshToken;
	}
	
	
}
