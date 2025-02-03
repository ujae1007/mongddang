package com.mongddang.backend.photo.entity;

import com.mongddang.backend.playlist.entity.Playlist;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "photo")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private int photoId;

    @ManyToOne(fetch = FetchType.LAZY) // 🚀 Playlist와 N:1 관계
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @Column(name = "photo_URL", nullable = false)
    private String photoUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Photo() {}

    public Photo(Playlist playlist, String photoUrl) {
        this.playlist = playlist;
        this.photoUrl = photoUrl;
    }

    // Getter
    public int getPhotoId() { return photoId; }
    public Playlist getPlaylist() { return playlist; }
    public String getPhotoUrl() { return photoUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public void setPlaylist(Playlist playlist) { this.playlist = playlist; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
