package com.mongddang.backend.album.dto;

import java.time.LocalDateTime;

public class AlbumResponseDto {
    private int albumId;
    private int userId;
    private String title;
    private String albumImageUrl;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AlbumResponseDto(int albumId, int userId, String title, String albumImageUrl, boolean status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.albumId = albumId;
        this.userId = userId;
        this.title = title;
        this.albumImageUrl = albumImageUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getAlbumId() { return albumId; }
    public int getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getAlbumImageUrl() { return albumImageUrl; }
    public boolean isStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
