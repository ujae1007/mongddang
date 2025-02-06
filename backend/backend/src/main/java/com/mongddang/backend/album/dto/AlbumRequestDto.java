package com.mongddang.backend.album.dto;

public class AlbumRequestDto {
//    private int userId;
    private String title;
    private String albumImageUrl;
    private boolean status;

    // 기본 생성자 (Spring이 JSON → DTO 변환할 때 필요)
    public AlbumRequestDto() {}

    // 모든 필드를 초기화하는 생성자
    public AlbumRequestDto(String title, String albumImageUrl, boolean status) {
        this.title = title;
        this.albumImageUrl = albumImageUrl;
        this.status = status;
    }
//    public AlbumRequestDto(int userId, String title, String albumImageUrl, boolean status) {
//        this.userId = userId;
//        this.title = title;
//        this.albumImageUrl = albumImageUrl;
//        this.status = status;
//    }

    // Getter 메서드 추가 (Lombok 없이 사용하려면 직접 구현해야 함)
//    public int getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getAlbumImageUrl() { return albumImageUrl; }
    public boolean isStatus() { return status; }
}
