package com.mongddang.backend.follow.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mongddang.backend.follow.dto.FollowDTO;
import com.mongddang.backend.follow.dto.FollowListDTO;
import com.mongddang.backend.follow.repository.FollowRepository;

@Service
public class FollowService {
	private final FollowRepository followRepository;
	
	public FollowService(FollowRepository followRepository) {
		this.followRepository = followRepository;
	}
	
	// 팔로우 상태 확인
	public boolean isAlreadyFollow(int followingId, int followedId) {
		int cnt = followRepository.isAlreadyFollow(followingId, followedId);
		return cnt >= 1;		// 팔로우 상태이면 true, 아니면 false 
	}
	
	
	
	
	// 팔로우 하기
	@Transactional
	public boolean doFollow(int followingId, int followedId) {
		FollowDTO followDTO = new FollowDTO();
		followDTO.setFollowingId(followingId);
		followDTO.setFollowedId(followedId);
		int cnt = followRepository.insertFollow(followDTO);
		return cnt == 1;
	}
	
	// 팔로우 취소
	@Transactional
	public boolean deleteFollow(int followingId, int followedId) {
		int cnt = followRepository.deleteFollow(followingId, followedId);
		return cnt == 1;
	}
	
	// 팔로잉한 유저 검색(특정 사용자가 팔로잉하는 사람)
	public List<FollowListDTO> followingList(int userId) {
		return followRepository.followingList(userId);
	}
	
	// 팔로잉 하는 유저 검색(특정 사용자를 팔로잉하는 사람)
	public List<FollowListDTO> followedList(int userId) {
		return followRepository.followedList(userId);
	}
}
