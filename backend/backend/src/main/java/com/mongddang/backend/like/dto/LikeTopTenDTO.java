package com.mongddang.backend.like.dto;

import java.util.List;

public class LikeTopTenDTO {
	private int albumId;
	private String title;
	private String albumImageURL;
	private String authorNickname;
	private List<LikeTopTenPlaylistDTO> playlists;
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
	public String getAlbumImageURL() {
		return albumImageURL;
	}
	public void setAlbumImageURL(String albumImageURL) {
		this.albumImageURL = albumImageURL;
	}
	public String getAuthorNickname() {
		return authorNickname;
	}
	public void setAuthorNickname(String authorNickname) {
		this.authorNickname = authorNickname;
	}
	public List<LikeTopTenPlaylistDTO> getPlaylists() {
		return playlists;
	}
	public void setPlaylists(List<LikeTopTenPlaylistDTO> playlists) {
		this.playlists = playlists;
	}
	
	
}
	
	

