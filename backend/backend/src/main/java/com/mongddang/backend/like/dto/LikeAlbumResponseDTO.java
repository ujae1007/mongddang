package com.mongddang.backend.like.dto;

import java.util.List;

public class LikeAlbumResponseDTO {
	private int id;
	private List<LikeAlbumDTO> likeAlbums;

	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<LikeAlbumDTO> getLikeAlbums() {
		return likeAlbums;
	}

	public void setLikeAlbums(List<LikeAlbumDTO> likeAlbums) {
		this.likeAlbums = likeAlbums;
	}
	
}
