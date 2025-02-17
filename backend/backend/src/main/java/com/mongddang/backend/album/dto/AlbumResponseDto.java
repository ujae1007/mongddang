package com.mongddang.backend.album.dto;

import com.mongddang.backend.playlist.dto.PlaylistDto;
import java.time.LocalDateTime;
import java.util.List;

public class AlbumResponseDto {
    private int albumId;
    private int userId;
    private String title;
    private String albumImageUrl;
    private boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PlaylistDto> playlists;
    private boolean isLiked;

    public AlbumResponseDto() {}
    
    // ✅ 기존 생성자도 유지 (플레이리스트 없는 경우)
    public AlbumResponseDto(int albumId, int userId, String title, String albumImageUrl, boolean status, 
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.albumId = albumId;
        this.userId = userId;
        this.title = title;
        this.albumImageUrl = albumImageUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.playlists = null; // ✅ 기본값으로 null 설정
    }
    
    public AlbumResponseDto(int albumId, int userId, String title, String albumImageUrl, boolean status, LocalDateTime createdAt, LocalDateTime updatedAt, List<PlaylistDto> playlists, boolean isLiked) {
        this.albumId = albumId;
        this.userId = userId;
        this.title = title;
        this.albumImageUrl = albumImageUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.playlists = playlists;
        this.isLiked = isLiked;
    }

    public int getAlbumId() { return albumId; }
    public int getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getAlbumImageUrl() { return albumImageUrl; }
    public boolean isStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<PlaylistDto> getPlaylists() { return playlists; }
    public boolean isLiked() { return isLiked; }
    
    // ✅ Setter 추가 (선택적으로 사용 가능)
    public void setLiked(boolean liked) { isLiked = liked; }
    public void setPlaylists(List<PlaylistDto> playlists) { this.playlists = playlists; }
}
