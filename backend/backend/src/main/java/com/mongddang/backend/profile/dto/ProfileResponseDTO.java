package com.mongddang.backend.profile.dto;


import java.util.List;



public class ProfileResponseDTO {
	private int userId;
	private String nickname;
	private List<AlbumDTO> albums;
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public List<AlbumDTO> getAlbums() {
		return albums;
	}
	public void setAlbums(List<AlbumDTO> albums) {
		this.albums = albums;
	}
	
	
}
