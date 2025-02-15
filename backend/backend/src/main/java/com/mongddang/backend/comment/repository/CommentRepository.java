package com.mongddang.backend.comment.repository;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.mongddang.backend.comment.dto.CommentListDTO;
import com.mongddang.backend.comment.dto.CommentRequestDTO;

public interface CommentRepository {
	// 댓글 조회
	public List<CommentListDTO> getComment(@Param("albumId") int albumId);
	
	
	// 댓글 생성
	public int insertComment(@Param("dto") CommentRequestDTO dto,
				            @Param("userId") int userId,
				            @Param("albumId") int albumId);
	
	// 댓글 수정
	public int updateComment(@Param("dto") CommentRequestDTO dto,
				            @Param("userId") int userId,
				            @Param("commentId") int commentId);
					
	// 댓글 삭제
	public int deleteComment(@Param("userId") int userId, @Param("commentId") int commentId);
}
