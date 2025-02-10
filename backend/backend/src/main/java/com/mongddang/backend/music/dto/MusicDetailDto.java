package com.mongddang.backend.music.dto;

public class MusicDetailDto {
    private int musicId;
    private String trackName;
    private String artistName;
    private String genre;
    private int popularity;
    
    //기본 생성자 (필수)
    public MusicDetailDto() {}

    // 매개변수 있는 생성자 추가 (이 오류를 해결하기 위함)
    public MusicDetailDto(int musicId, String trackName, String artistName, String genre, int popularity) {
        this.musicId = musicId;
        this.trackName = trackName;
        this.artistName = artistName;
        this.genre = genre;
        this.popularity = popularity;
    }
    
	public int getMusicId() {
		return musicId;
	}
	
	public void setMusicId(int musicId) {
		this.musicId = musicId;
	}
	public String getTrackName() {
		return trackName;
	}
	public void setTrackName(String trackName) {
		this.trackName = trackName;
	}
	public String getArtistName() {
		return artistName;
	}
	public void setArtistName(String artistName) {
		this.artistName = artistName;
	}
	public String getGenre() {
		return genre;
	}
	public void setGenre(String genre) {
		this.genre = genre;
	}
	public int getPopularity() {
		return popularity;
	}
	public void setPopularity(int popularity) {
		this.popularity = popularity;
	}
    
}