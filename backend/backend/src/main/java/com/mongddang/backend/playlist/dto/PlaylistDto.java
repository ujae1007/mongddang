package com.mongddang.backend.playlist.dto;

import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.photo.entity.Photo;
import com.mongddang.backend.music.dto.MusicDetailDto;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

public class PlaylistDto {
    private int playlistId;
    private int albumId;
    private Integer musicId;
    private Integer startTime;
    private Integer endTime;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String locationAddress;
    private List<String> photoUrls;
    private MusicDetailDto musicDetails;

    public PlaylistDto() {}

    public PlaylistDto(int playlistId, int albumId, Integer musicId, Integer startTime, Integer endTime, BigDecimal latitude, BigDecimal longitude, String locationAddress, List<String> photoUrls, MusicDetailDto musicDetails) {
        this.playlistId = playlistId;
        this.albumId = albumId;
        this.musicId = musicId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationAddress = locationAddress;
        this.photoUrls = photoUrls;
        this.musicDetails = musicDetails;
    }
    
    public PlaylistDto(Playlist playlist) {
        this.playlistId = playlist.getPlaylistId();
        this.albumId = playlist.getAlbum().getAlbumId(); // 🚨 Lazy Loading 방지
        this.musicId = playlist.getMusicId();
        this.startTime = playlist.getStartTime();
        this.endTime = playlist.getEndTime();
        this.latitude = playlist.getLatitude();
        this.longitude = playlist.getLongitude();
        this.locationAddress = playlist.getLocationAddress();
        // Photo URL 리스트 변환 (Photo 객체의 photoUrl)
        if (playlist.getPhotos() != null) {
            this.photoUrls = playlist.getPhotos().stream()
                    .map(Photo::getPhotoUrl)
                    .collect(Collectors.toList());
        }
    }

    public int getPlaylistId() { return playlistId; }
    public int getAlbumId() { return albumId; }
    public Integer getMusicId() { return musicId; }
    public Integer getStartTime() { return startTime; }
    public Integer getEndTime() { return endTime; }
    public BigDecimal getLatitude() { return latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public String getLocationAddress() { return locationAddress; }
    public List<String> getPhotoUrls() { return photoUrls; }
    public MusicDetailDto getMusicDetails() {
        return musicDetails;
    }
    public void setPlaylistId(int playlistId) {
		this.playlistId = playlistId;
	}

	public void setAlbumId(int albumId) {
		this.albumId = albumId;
	}

	public void setMusicId(Integer musicId) {
		this.musicId = musicId;
	}

	public void setStartTime(Integer startTime) {
		this.startTime = startTime;
	}

	public void setEndTime(Integer endTime) {
		this.endTime = endTime;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

	public void setLocationAddress(String locationAddress) {
		this.locationAddress = locationAddress;
	}

	public void setPhotoUrls(List<String> photoUrls) {
		this.photoUrls = photoUrls;
	}

	public void setMusicDetails(MusicDetailDto musicDetails) {
        this.musicDetails = musicDetails;
    }
}
