package com.mongddang.backend.like.dto;

public class LikeTopTenPlaylistDTO {
	private int playlistId;
	private String locationAddress;
	private LikeAlbumMusicDTO music;
	public int getPlaylistId() {
		return playlistId;
	}
	public void setPlaylistId(int playlistId) {
		this.playlistId = playlistId;
	}
	public String getLocationAddress() {
		return locationAddress;
	}
	public void setLocationAddress(String locationAddress) {
		this.locationAddress = locationAddress;
	}
	public LikeAlbumMusicDTO getMusic() {
		return music;
	}
	public void setMusic(LikeAlbumMusicDTO music) {
		this.music = music;
	}
	
	
}
