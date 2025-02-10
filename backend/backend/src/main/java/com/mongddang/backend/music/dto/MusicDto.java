package com.mongddang.backend.music.dto;

import com.mongddang.backend.music.entity.Music;

public class MusicDto {
    private int musicId;
    private String trackName;
    private String trackId;
    private String artistName;
    private String artistId;
    private int popularity;
    private String genre;

    public MusicDto() {}

    public MusicDto(Music music) {
        this.musicId = music.getMusicId();
        this.trackName = music.getTrackName();
        this.trackId = music.getTrackId();
        this.artistName = music.getArtistName();
        this.artistId = music.getArtistId();
        this.popularity = music.getPopularity();
        this.genre = music.getGenre();
    }

    public int getMusicId() { return musicId; }
    public String getTrackName() { return trackName; }
    public String getTrackId() { return trackId; }
    public String getArtistName() { return artistName; }
    public String getArtistId() { return artistId; }
    public int getPopularity() { return popularity; }
    public String getGenre() { return genre; }
}
