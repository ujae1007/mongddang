package com.mongddang.backend.profile.dto;

import java.util.List;

public class PlaylistDTO {
	private int playlistId;
	private Double latitude;
	private Double longitude;
	private String locationAddress;
	private MusicDTO music;
	private List<PhotoDTO> photos;
	
	public int getPlaylistId() {
		return playlistId;
	}
	public void setPlaylistId(int playlistId) {
		this.playlistId = playlistId;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public String getLocationAddress() {
		return locationAddress;
	}
	public void setLocationAddress(String locationAddress) {
		this.locationAddress = locationAddress;
	}
	public MusicDTO getMusic() {
		return music;
	}
	public void setMusic(MusicDTO music) {
		this.music = music;
	}
	public List<PhotoDTO> getPhotos() {
		return photos;
	}
	public void setPhotos(List<PhotoDTO> photos) {
		this.photos = photos;
	}
	
	
}
