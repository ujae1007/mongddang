package com.mongddang.backend.like.dto;

import java.util.List;

public class LikeAlbumPlaylistDTO {
	private int playlistId;
	private String locationAddress;
	private LikeAlbumMusicDTO music;
	private List<LikeAlbumPhotoDTO> photos;
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
	public List<LikeAlbumPhotoDTO> getPhotos() {
		return photos;
	}
	public void setPhotos(List<LikeAlbumPhotoDTO> photos) {
		this.photos = photos;
	}
	
	
	
}
