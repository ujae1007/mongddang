package com.mongddang.backend.comment.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mongddang.backend.comment.dto.CommentListDTO;
import com.mongddang.backend.comment.dto.CommentRequestDTO;
import com.mongddang.backend.comment.repository.CommentRepository;
import com.mongddang.backend.user.repository.UserRepository;

@Service
public class CommentService {
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	
	public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
		this.commentRepository = commentRepository;
		this.userRepository = userRepository;
	}
	
	// 댓글 조회
	public List<CommentListDTO> getCommentList(int albumId) {
		return commentRepository.getComment(albumId);
	}
	
	
	
	// 댓글 생성
	@Transactional
	public boolean writeComment(CommentRequestDTO commentRequestDTO, int userId, int albumId) {
		return commentRepository.insertComment(commentRequestDTO, userId, albumId) == 1;
	}
	
	// 댓글 수정
	@Transactional
	public boolean updateComment(CommentRequestDTO commentRequestDTO, int userId, int commentId) {
		return commentRepository.updateComment(commentRequestDTO, userId, commentId) == 1;
	}
	
	// 댓글 삭제
	@Transactional
	public boolean deleteComment(int userId, int commentId) {
		return commentRepository.deleteComment(userId, commentId) == 1;
		
	}
}
