package com.mongddang.backend.search.dto;

import java.time.LocalDateTime;

public class SearchAlbumDto {
    private int albumId;
    private String title;
    private String albumImageUrl;
    private boolean status;
    private LocalDateTime createdAt;
    private String nickname;

    public SearchAlbumDto() {}

    public SearchAlbumDto(int albumId, String title, String albumImageUrl, boolean status, LocalDateTime createdAt, String nickname) {
        this.albumId = albumId;
        this.title = title;
        this.albumImageUrl = albumImageUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.nickname = nickname;
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
    public String getAlbumImageUrl() {
        return albumImageUrl;
    }
    public void setAlbumImageUrl(String albumImageUrl) {
        this.albumImageUrl = albumImageUrl;
    }
    public boolean isStatus() {
        return status;
    }
    public void setStatus(boolean status) {
        this.status = status;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getNickname() { 
    	return nickname; 
    }
    // ✅ 닉네임 Getter 추가
    public void setNickname(String nickname) { 
    	this.nickname = nickname; 
    }
}
