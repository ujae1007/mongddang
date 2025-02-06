package com.mongddang.backend.album.entity;

import jakarta.persistence.*;
// import User Entity에서 User 객체 가져다 외래키로 참조한다 했을때 해줘야함
import java.time.LocalDateTime;

@Entity // 🚀 JPA를 위한 엔티티 클래스
@Table(name = "album") // DB 테이블 명과 매핑
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 🚀 Auto Increment 적용
    @Column(name = "album_id")
    private int albumId;  // 기본키

//    외래키로 가져다 사용한다고 했을때
//    아래쪽 Getter과 Setter도 수정해줘야함
//    Dto나 다른 파트들도 다 수정해주기!!!
//    @ManyToOne(fetch = FetchType.LAZY)  // 🔥 N:1 관계 (여러 개의 Album이 하나의 User를 참조)
//    @JoinColumn(name = "user_id", nullable = false)  // 🔗 user_id를 외래 키로 사용
//    private User userId;
    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "album_image_URL")
    private String albumImageUrl;

    @Column(name = "status", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean status = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate  // ✅ 업데이트 시 자동으로 갱신
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 기본 생성자 (JPA는 기본 생성자가 필요함)
    public Album() {}

    // 생성자 추가
    public Album(int userId, String title, String albumImageUrl, boolean status) {
        this.userId = userId;
        this.title = title;
        this.albumImageUrl = albumImageUrl;
        this.status = status;
    }

    // Getter 추가
    public int getAlbumId() { 
    	return albumId; 
    }
    
    public int getUserId() {
    	return userId;
    }
    
    public String getTitle() {
    	return title;
    }
    
    public String getAlbumImageUrl() {
    	return albumImageUrl;
    }

    public boolean isStatus() {
    	return status;
    }
    
    public LocalDateTime getCreatedAt() {
    	return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
    	return updatedAt;
    }

    
    // Setter 추가
    public void setUserId(int userId) {
    	this.userId = userId;
    }
    
    public void setTitle(String title) {
    	this.title = title;
    }
    
    public void setAlbumImageUrl(String albumImageUrl) {
    	this.albumImageUrl = albumImageUrl;
    }
    
    public void setStatus(boolean status) {
    	this.status = status;
    }
}