package com.mongddang.backend.follow.dto;

import java.util.Date;

public class FollowDTO {
	private int followId;
	private int followingId; //팔로우 거는 사람
	private int followedId; // 팔로우 당하는 사람
	private Date createdAt;
	
	public int getFollowId() {
		return followId;
	}
	public void setFollowId(int followId) {
		this.followId = followId;
	}
	public int getFollowingId() {
		return followingId;
	}
	public void setFollowingId(int followingId) {
		this.followingId = followingId;
	}
	public int getFollowedId() {
		return followedId;
	}
	public void setFollowedId(int followedId) {
		this.followedId = followedId;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	} 
	
	
}
