package com.mongddang.backend.like.repository;

import org.apache.ibatis.annotations.Param;

import com.mongddang.backend.like.dto.LikeAlbumResponseDTO;
import com.mongddang.backend.like.dto.LikeDTO;

public interface LikeRepository {
	// 좋아요 상태 확인
	public int isAlreadyLike(@Param("userId") int userId, @Param("albumId") int albumId);
	
	// 좋아요 생성
	public int insertLike(LikeDTO likeDTO);
	
	// 종아요 취소
	public int deleteLike(LikeDTO likeDTO);
	
	// 좋아요 한 앨범 목록 조회
	public LikeAlbumResponseDTO getLikeAlbumList(int userId);
}
