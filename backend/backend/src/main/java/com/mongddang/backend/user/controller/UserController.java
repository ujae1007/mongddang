package com.mongddang.backend.user.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.user.dto.SignupRequestDTO;
import com.mongddang.backend.user.dto.UpdateUserDTO;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserController {
	
	private final UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	
	// 회원가입
	@PostMapping(value = "/signup", consumes = "multipart/form-data")
	public ResponseEntity<?> registerUser(@ModelAttribute SignupRequestDTO signupRequestDTO){
		try {
           
            // 사용자 등록
            userService.signUp(signupRequestDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공");
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
        }
	}
	
	// 회원정보 수정
	@PutMapping(value = "/update", consumes = "multipart/form-data" )
	public ResponseEntity<?> updateUser(@ModelAttribute UpdateUserDTO updateUserDTO, Principal principal){
		try {
			String currentEmail = principal.getName();		 //현재 인증된 사용자의 이메일추출
			boolean isUpdated = userService.updateUser(currentEmail, updateUserDTO);
			if(isUpdated) {
				return ResponseEntity.ok("회원 정보 수정 성공");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 실패");
			}
		} catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: " + e.getMessage());
        }
	}
	
}
 