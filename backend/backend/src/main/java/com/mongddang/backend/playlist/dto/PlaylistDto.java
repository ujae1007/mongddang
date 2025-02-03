package com.mongddang.backend.playlist.dto;

import com.mongddang.backend.playlist.entity.Playlist;

public class PlaylistDto {
    private int playlistId;
    private int albumId;
    private Integer musicId;
    private Integer startTime;
    private Integer endTime;
    private String locationAddress;

    public PlaylistDto() {}

    public PlaylistDto(int playlistId, int albumId, Integer musicId, Integer startTime, Integer endTime, String locationAddress) {
        this.playlistId = playlistId;
        this.albumId = albumId;
        this.musicId = musicId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.locationAddress = locationAddress;
    }
    
    public PlaylistDto(Playlist playlist) {
        this.playlistId = playlist.getPlaylistId();
        this.albumId = playlist.getAlbum().getAlbumId(); // 🚨 Lazy Loading 방지
        this.musicId = playlist.getMusicId();
        this.startTime = playlist.getStartTime();
        this.endTime = playlist.getEndTime();
        this.locationAddress = playlist.getLocationAddress();
    }

    public int getPlaylistId() { return playlistId; }
    public int getAlbumId() { return albumId; }
    public Integer getMusicId() { return musicId; }
    public Integer getStartTime() { return startTime; }
    public Integer getEndTime() { return endTime; }
    public String getLocationAddress() { return locationAddress; }
}


//package com.mongddang.backend.playlist.dto;
//
//import java.time.LocalDateTime;
//
//public class PlaylistDto {
//
//    private Integer playlistId;
//    private Integer albumId;
//    private Integer musicId;
//    private int startTime;
//    private int endTime;
//    private String locationAddress;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//
//    public PlaylistDto() {
//    }
//
//    public PlaylistDto(Integer playlistId, Integer albumId, Integer musicId,
//                       int startTime, int endTime, String locationAddress,
//                       LocalDateTime createdAt, LocalDateTime updatedAt) {
//        this.playlistId = playlistId;
//        this.albumId = albumId;
//        this.musicId = musicId;
//        this.startTime = startTime;
//        this.endTime = endTime;
//        this.locationAddress = locationAddress;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//    }
//
//    public Integer getPlaylistId() {
//        return playlistId;
//    }
//    public void setPlaylistId(Integer playlistId) {
//        this.playlistId = playlistId;
//    }
//
//    public Integer getAlbumId() {
//        return albumId;
//    }
//    public void setAlbumId(Integer albumId) {
//        this.albumId = albumId;
//    }
//
//    public Integer getMusicId() {
//        return musicId;
//    }
//    public void setMusicId(Integer musicId) {
//        this.musicId = musicId;
//    }
//
//    public int getStartTime() {
//        return startTime;
//    }
//    public void setStartTime(int startTime) {
//        this.startTime = startTime;
//    }
//
//    public int getEndTime() {
//        return endTime;
//    }
//    public void setEndTime(int endTime) {
//        this.endTime = endTime;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//}
