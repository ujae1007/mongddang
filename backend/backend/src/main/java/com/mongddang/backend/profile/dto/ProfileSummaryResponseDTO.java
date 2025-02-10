package com.mongddang.backend.profile.dto;

import java.util.List;

public class ProfileSummaryResponseDTO {
    private int userId;
    private String nickname;
    private String profileImageURL;
    private String introduce;
    private boolean followStatus;
    private int followingCnt;  // 사용자가 팔로우 하는 수
    private int followedCnt;   // 사용자를 팔로우 하는 수
    private List<AlbumSummaryDTO> albums;
    
    // Getter & Setter
    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    public String getNickname() {
        return nickname;
    }
    public boolean isFollowStatus() {
		return followStatus;
	}
	public void setFollowStatus(boolean followStatus) {
		this.followStatus = followStatus;
	}
	public void setNickname(String nickname) {
        this.nickname = nickname;
    }
    public String getProfileImageURL() {
        return profileImageURL;
    }
    public void setProfileImageURL(String profileImageURL) {
        this.profileImageURL = profileImageURL;
    }
    public String getIntroduce() {
        return introduce;
    }
    public void setIntroduce(String introduce) {
        this.introduce = introduce;
    }
    public int getFollowingCnt() {
        return followingCnt;
    }
    public void setFollowingCnt(int followingCnt) {
        this.followingCnt = followingCnt;
    }
    public int getFollowedCnt() {
        return followedCnt;
    }
    public void setFollowedCnt(int followedCnt) {
        this.followedCnt = followedCnt;
    }
    public List<AlbumSummaryDTO> getAlbums() {
        return albums;
    }
    public void setAlbums(List<AlbumSummaryDTO> albums) {
        this.albums = albums;
    }
}
