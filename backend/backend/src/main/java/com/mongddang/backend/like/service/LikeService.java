package com.mongddang.backend.like.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mongddang.backend.like.dto.LikeAlbumResponseDTO;
import com.mongddang.backend.like.dto.LikeDTO;
import com.mongddang.backend.like.dto.LikeTopTenResponseDTO;
import com.mongddang.backend.like.repository.LikeRepository;

@Service
public class LikeService {
	private final LikeRepository likeRepository;
	
	public LikeService(LikeRepository likeRepository) {
		this.likeRepository = likeRepository;
	}
	// 좋아요 상태 확인
	public boolean isAlreadyLike(int userId, int albumdId) {
		int cnt = likeRepository.isAlreadyLike(userId, albumdId);
		return cnt >= 1; // 이미 좋아요 상태이면 true, 아니면 false
	}
	
	
	
	// 좋아요 생성
	@Transactional
	public boolean addLike(int albumId, int userId) {
		LikeDTO likeDTO = new LikeDTO();
		likeDTO.setAlbumId(albumId);
		likeDTO.setUserId(userId);
		int cnt = likeRepository.insertLike(likeDTO);
		return cnt >= 1;
	}
	
	
	// 좋아요 삭제
	@Transactional
	public boolean deleteLike(int albumId, int userId) {
		LikeDTO likeDTO = new LikeDTO();
		likeDTO.setAlbumId(albumId);
		likeDTO.setUserId(userId);
		int cnt = likeRepository.deleteLike(likeDTO);
		return cnt >= 1;
	}
	
	// 내가 좋아요 한 앨범들 조회
	public LikeAlbumResponseDTO getLikeAlbums(int userId) {
		return likeRepository.getLikeAlbumList(userId);
	}
	
	// Like Top-10 Album 조회
	public LikeTopTenResponseDTO getLikeTopTenList() {
		return likeRepository.getLikeTopTenList();
	}
	
}
