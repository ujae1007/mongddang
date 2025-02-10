package com.mongddang.backend.profile.dto;

import java.util.Date;

public class AlbumSummaryDTO {
	private int albumId;
	private String title;
	private Date createdAt;
	private String albumImageURL;
	public int getAlbumId() {
		return albumId;
	}
	public void setAlbumId(int albumId) {
		this.albumId = albumId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date creatAt) {
		this.createdAt = creatAt;
	}
	public String getAlbumImageURL() {
		return albumImageURL;
	}
	public void setAlbumImageURL(String albumImageURL) {
		this.albumImageURL = albumImageURL;
	}
	
	
}
