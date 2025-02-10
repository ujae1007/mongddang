package com.mongddang.backend.music.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "music")
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "music_id")
    private int musicId;

    @Column(name = "track_name", nullable = false)
    private String trackName;

    @Column(name = "track_id", nullable = false)
    private String trackId;

    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @Column(name = "artist_id", nullable = false)
    private String artistId;

    @Column(name = "popularity", nullable = false)
    private int popularity;

    @Column(name = "genre", nullable = false)
    private String genre;

    public Music() {}

    public Music(String trackName, String trackId, String artistName, String artistId, int popularity, String genre) {
        this.trackName = trackName;
        this.trackId = trackId;
        this.artistName = artistName;
        this.artistId = artistId;
        this.popularity = popularity;
        this.genre = genre;
    }

    public int getMusicId() { return musicId; }
    public String getTrackName() { return trackName; }
    public String getTrackId() { return trackId; }
    public String getArtistName() { return artistName; }
    public String getArtistId() { return artistId; }
    public int getPopularity() { return popularity; }
    public String getGenre() { return genre; }
}
