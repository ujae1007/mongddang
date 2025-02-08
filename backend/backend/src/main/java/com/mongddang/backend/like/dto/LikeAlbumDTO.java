package com.mongddang.backend.like.dto;

import java.util.Date;
import java.util.List;

public class LikeAlbumDTO {
	private int albumId;
	private String title;
	private Date createdAt;
	private String albumImageURL;
	private String authorNickname;
	private List<LikeAlbumPlaylistDTO> playlists;
	
	public String getAlbumImageURL() {
		return albumImageURL;
	}
	public void setAlbumImageURL(String albumImageURL) {
		this.albumImageURL = albumImageURL;
	}
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
	public List<LikeAlbumPlaylistDTO> getPlaylists() {
		return playlists;
	}
	public void setPlaylists(List<LikeAlbumPlaylistDTO> playlists) {
		this.playlists = playlists;
	}
	public String getAuthorNickname() {
		return authorNickname;
	}
	public void setAuthorNickname(String authorNickname) {
		this.authorNickname = authorNickname;
	}
	
	
	
}
