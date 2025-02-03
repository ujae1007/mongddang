package com.mongddang.backend.playlist.entity;

import com.mongddang.backend.album.entity.Album;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "playlist")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playlist_id")
    private int playlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @Column(name = "music_id", nullable = true) // 🚀 music_id만 저장 (Foreign Key)
    private Integer musicId;

    @Column(name = "start_time", nullable = true)
    private Integer startTime;

    @Column(name = "end_time", nullable = true)
    private Integer endTime;

    @Column(name = "location_address", nullable = true)
    private String locationAddress;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Playlist() {}

    public Playlist(Album album) {
        this.album = album;
    }

    // Getter & Setter
    public int getPlaylistId() { return playlistId; }
    public Album getAlbum() { return album; }
    public Integer getMusicId() { return musicId; }
    public Integer getStartTime() { return startTime; }
    public Integer getEndTime() { return endTime; }
    public String getLocationAddress() { return locationAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setMusicId(Integer musicId) { this.musicId = musicId; }
    public void setStartTime(Integer startTime) { this.startTime = startTime; }
    public void setEndTime(Integer endTime) { this.endTime = endTime; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
}


//package com.mongddang.backend.playlist.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "playlist")
//public class Playlist {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "playlist_id")
//    private Integer playlistId;
//
//    @Column(name = "album_id", nullable = false)
//    private Integer albumId;
//
//    @Column(name = "music_id", nullable = false)
//    private Integer musicId;
//
//    @Column(name = "start_time", columnDefinition = "INT default 0")
//    private int startTime;
//
//    @Column(name = "end_time", columnDefinition = "INT default 0")
//    private int endTime;
//
//    @Column(name = "created_at", insertable = false, updatable = false)
//    private LocalDateTime createdAt;
//
//    @Column(name = "updated_at", insertable = false, updatable = false)
//    private LocalDateTime updatedAt;
//    
//    @Column(name = "location_address", nullable = false)
//    private String locationAddress;
//
//    @PreUpdate  // ✅ 업데이트 시 자동으로 갱신
//    public void preUpdate() {
//        this.updatedAt = LocalDateTime.now();
//    }
//    
//    public Playlist() {
//    }
//
//    public Playlist(Integer playlistId, Integer albumId, Integer musicId,
//                    int startTime, int endTime, LocalDateTime createdAt, LocalDateTime updatedAt, String locationAddress) {
//        this.playlistId = playlistId;
//        this.albumId = albumId;
//        this.musicId = musicId;
//        this.startTime = startTime;
//        this.endTime = endTime;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//        this.locationAddress = locationAddress;
//    }
//
//    // Getter 생성
//	public Integer getPlaylistId() {
//		return playlistId;
//	}
//
//	public Integer getAlbumId() {
//		return albumId;
//	}
//
//	public Integer getMusicId() {
//		return musicId;
//	}
//
//	public int getStartTime() {
//		return startTime;
//	}
//
//	public int getEndTime() {
//		return endTime;
//	}
//
//	public LocalDateTime getCreatedAt() {
//		return createdAt;
//	}
//
//	public LocalDateTime getUpdatedAt() {
//		return updatedAt;
//	}
//
//	public String getLocationAddress() {
//		return locationAddress;
//	}
//
//	// Setter 생성
//	public void setMusicId(Integer musicId) {
//		this.musicId = musicId;
//	}
//	
//	public void setAlbumId(Integer albumId) {
//		this.albumId = albumId;
//	}
//	
//	public void setStartTime(int startTime) {
//		this.startTime = startTime;
//	}
//	
//	public void setEndTime(int endTime) {
//		this.endTime = endTime;
//	}
//	
//	public void setLocationAddress(String locationAddress) {
//		this.locationAddress = locationAddress;
//	}
//
//
//}
