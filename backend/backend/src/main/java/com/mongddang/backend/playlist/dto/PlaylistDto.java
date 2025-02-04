package com.mongddang.backend.playlist.dto;

import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.photo.entity.Photo;
import java.util.List;
import java.util.stream.Collectors;

public class PlaylistDto {
    private int playlistId;
    private int albumId;
    private Integer musicId;
    private Integer startTime;
    private Integer endTime;
    private String locationAddress;
    private List<String> photoUrls;

    public PlaylistDto() {}

    public PlaylistDto(int playlistId, int albumId, Integer musicId, Integer startTime, Integer endTime, String locationAddress, List<String> photoUrls) {
        this.playlistId = playlistId;
        this.albumId = albumId;
        this.musicId = musicId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.locationAddress = locationAddress;
        this.photoUrls = photoUrls;
    }
    
    public PlaylistDto(Playlist playlist) {
        this.playlistId = playlist.getPlaylistId();
        this.albumId = playlist.getAlbum().getAlbumId(); // 🚨 Lazy Loading 방지
        this.musicId = playlist.getMusicId();
        this.startTime = playlist.getStartTime();
        this.endTime = playlist.getEndTime();
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
    public String getLocationAddress() { return locationAddress; }
    public List<String> getPhotoUrls() { return photoUrls; }
}

