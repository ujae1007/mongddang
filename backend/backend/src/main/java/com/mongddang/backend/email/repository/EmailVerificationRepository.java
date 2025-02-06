package com.mongddang.backend.email.repository;


import com.mongddang.backend.email.dto.VerificationDTO;

public interface EmailVerificationRepository {
	// 인증 레코드 삽입
	public int insertEmailVerification(VerificationDTO verificationDTO);
	
	// 이메일로 인증 레코드 찾기
	public VerificationDTO findByEmail(String email);
	
//	// 만료된 인증번호 삭제
//	public int deleteExpiredVerification();
	
	// 인증 레코드 자체 삭제
	public int deleteByEmail(String email);
}
