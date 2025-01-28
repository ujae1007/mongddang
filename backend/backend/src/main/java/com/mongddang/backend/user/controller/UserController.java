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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongddang.backend.email.service.EmailVerificationService;
import com.mongddang.backend.user.dto.SignupRequestDTO;
import com.mongddang.backend.user.dto.UpdateUserDTO;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserController {
	
	private final UserService userService;
	private final EmailVerificationService emailVerificationService;
	
	public UserController(UserService userService, EmailVerificationService emailVerificationService) {
		this.userService = userService;
		this.emailVerificationService = emailVerificationService;
	}
	// 이메일로 인증번호 전송
	@PostMapping("/sendemail")
	public ResponseEntity<?> sendVerificationCode(@RequestParam("email") String email){
		try {
			// 이미 가입된 이메일인지 확인
			if(userService.isExistsEmail(email)) {
				return ResponseEntity.badRequest().body("이미 가입된 이메일입니다.");
			}
			// 인증번호 발송
			emailVerificationService.sendVerificationCode(email);
			return ResponseEntity.ok("인증 번호 발송");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 에러: " + e.getMessage());
		}
	}
	
	// 사용자가 입력한 인증번호 인증
	@PostMapping("/verifycode")
	public ResponseEntity<?> verifyCode(@RequestParam("email") String email, @RequestParam("code") String code){
		boolean result = emailVerificationService.verifyCode(email, code);
		if (result) {
			return ResponseEntity.ok("인증 성공");
		} else {
			return ResponseEntity.badRequest().body("인증 실패");
		}
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
 