package com.mongddang.backend.comment.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.comment.dto.CommentRequestDTO;
import com.mongddang.backend.comment.service.CommentService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;


@RestController
@RequestMapping("/api/comment")
public class CommentController {
	
	private final CommentService commentService;
	private final UserService userService;
	
	
	public CommentController(CommentService commentService, UserService userService) {
		this.commentService = commentService;
		this.userService = userService;
	}
	
	// 댓글 생성 -> JSON으로 요청 보내야 됨
	@PostMapping("/{album_id}")
	public ResponseEntity<?> write(@PathVariable("album_id") int albumId, Principal principal, @RequestBody CommentRequestDTO commentRequestDTO){
		
		
		try {
			String currentEmail = principal.getName();
			UserDTO userDTO = userService.getUserByEmail(currentEmail);
			int userId = userDTO.getUserId();
			
			commentService.writeComment(commentRequestDTO, userId, albumId);
			
			return ResponseEntity.status(HttpStatus.CREATED).body("댓글 생성 성공");
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
	
	// 댓글 수정
	@PutMapping("/{comment_id}")
	public ResponseEntity<?> update(@PathVariable("comment_id") int commentId, Principal principal ,@RequestBody CommentRequestDTO commentRequestDTO){
		try {
			String currentEmail = principal.getName();
			UserDTO userDTO = userService.getUserByEmail(currentEmail);
			int userId = userDTO.getUserId();
			
			commentService.updateComment(commentRequestDTO, userId, commentId);
			
			return ResponseEntity.ok("댓글 수정 성공");
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
	
	// 댓글 삭제
	@DeleteMapping("/{comment_id}")
	public ResponseEntity<?> delete(@PathVariable("comment_id") int commentId, Principal principal){
		try {
			String currentEmail = principal.getName();
			UserDTO userDTO = userService.getUserByEmail(currentEmail);
			int userId = userDTO.getUserId();
			
			commentService.deleteComment(userId, commentId);
			
			return ResponseEntity.ok("댓글 삭제 성공");
		} catch (Exception e) {
			return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
		}
	}
	
	
}
