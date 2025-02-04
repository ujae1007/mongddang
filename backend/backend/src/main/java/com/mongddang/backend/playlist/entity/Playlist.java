package com.mongddang.backend.playlist.entity;

import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.photo.entity.Photo;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

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
    
    // Playlist와 Photo의 1:N 관계 추가
    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Photo> photos;
    
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
    public List<Photo> getPhotos() { return photos; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setMusicId(Integer musicId) { this.musicId = musicId; }
    public void setStartTime(Integer startTime) { this.startTime = startTime; }
    public void setEndTime(Integer endTime) { this.endTime = endTime; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
    public void setPhotos(List<Photo> photos) { this.photos = photos; }
}

