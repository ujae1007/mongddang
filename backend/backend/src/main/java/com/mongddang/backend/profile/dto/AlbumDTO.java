package com.mongddang.backend.profile.dto;

import java.util.Date;
import java.util.List;

import javax.xml.crypto.Data;

public class AlbumDTO {
	private int albumId;
	private String title;
	private Date createdAt;
	private List<PlaylistDTO> playlists;
	
	
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
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public List<PlaylistDTO> getPlaylists() {
		return playlists;
	}
	public void setPlaylists(List<PlaylistDTO> playlists) {
		this.playlists = playlists;
	}
	
	
}
