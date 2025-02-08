package com.mongddang.backend.like.dto;

import java.util.List;

public class LikeTopTenResponseDTO {
	private int id; // dummy
	private List<LikeTopTenDTO> likeTopTenLists;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public List<LikeTopTenDTO> getLikeTopTenLists() {
		return likeTopTenLists;
	}
	public void setLikeTopTenLists(List<LikeTopTenDTO> likeTopTenLists) {
		this.likeTopTenLists = likeTopTenLists;
	}
	
	
}
