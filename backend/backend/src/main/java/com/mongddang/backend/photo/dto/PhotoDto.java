package com.mongddang.backend.photo.dto;

import com.mongddang.backend.photo.entity.Photo;

public class PhotoDto {
    private int photoId;
    private int playlistId;
    private String photoUrl;

    public PhotoDto() {}

    public PhotoDto(Photo photo) {  // ✅ Entity → DTO 변환
        this.photoId = photo.getPhotoId();
        this.playlistId = photo.getPlaylist().getPlaylistId();
        this.photoUrl = photo.getPhotoUrl();
    }

    public int getPhotoId() { return photoId; }
    public int getPlaylistId() { return playlistId; }
    public String getPhotoUrl() { return photoUrl; }
}
