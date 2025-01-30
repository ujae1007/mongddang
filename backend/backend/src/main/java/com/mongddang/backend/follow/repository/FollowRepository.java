package com.mongddang.backend.follow.repository;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.mongddang.backend.follow.dto.FollowDTO;

public interface FollowRepository {
	
	// 이미 팔로우 중인지 확인
	public int isAlreadyFollow(@Param("followingId") int followingId, @Param("followedId") int followedId);
	
	
	// 팔로우 생성
	public int insertFollow(FollowDTO followDTO);
	
	// 팔로우 삭제
	public int deleteFollow(@Param("followingId") int followingId, @Param("followedId") int followedId);
	
	// 팔로잉한 유저 검색 
	public List<FollowDTO> followingList(@Param("followingId") int followingId);
	
	
	// 팔로잉 하는 유저 검색 
	public List<FollowDTO> followedList(@Param("followedId") int followedId);
	
}
