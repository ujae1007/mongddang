package com.mongddang.backend.email.service;

import java.util.Calendar;
import java.util.Date;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.mongddang.backend.email.dto.VerificationDTO;
import com.mongddang.backend.email.repository.EmailVerificationRepository;

// 인증 번호 생성, 저장, 검증, 정리
@Service
public class EmailVerificationService {
	private final EmailVerificationRepository emailVerificationRepository;
	private final EmailService emailService;
	
	public EmailVerificationService(EmailVerificationRepository emailVerificationRepository, EmailService emailService) {
		this.emailService = emailService;
		this.emailVerificationRepository = emailVerificationRepository;
	}
	
	// 인증번호 만료 시간(분 단위) : 5분
	private static final int CODE_EXPIRATION_MINUTES = 5;
	
	
	// 랜덤 인증 번호 생성 및 db 저장 및 이메일 발송
	public void sendVerificationCode(String email) {
		// 랜덤 숫자 6자리 생성
		String verificationCode = generateRandomCode(6);
		
		// 유효 시간 계산
		Date now = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(now);
		cal.add(Calendar.MINUTE, CODE_EXPIRATION_MINUTES);
		Date expiredAt = cal.getTime();
		
		// DB 저장
		VerificationDTO verificationDTO = new VerificationDTO();
		verificationDTO.setEmail(email);
		verificationDTO.setVerificationCode(verificationCode);
		verificationDTO.setCreatedAt(now);
		verificationDTO.setExpiredAt(expiredAt);
		
		emailVerificationRepository.insertEmailVerification(verificationDTO);
		
		// 실제 이메일 발송
		String subject = "mongddang 이메일 인증 안내";
        String text = "요청하신 인증번호는 [" + verificationCode + "] 입니다.\n"
                    + "해당 인증번호를 " + CODE_EXPIRATION_MINUTES + "분 이내에 입력해주세요.";
        emailService.sendSimpleMail(email, subject, text);
		
	}
	
	// 사용자가 입력한 인증코드 확인
	public boolean verifyCode(String email, String inputcode) {
		VerificationDTO verificationDTO = emailVerificationRepository.findByEmail(email);
		verificationDTO.toString();
		if (verificationDTO == null) {
			return false;
		}
		// 만료시간체크
		Date now = new Date();
		if (verificationDTO.getExpiredAt().before(now)){
			// 만약 만료됐다면 -> db에서 지우고 false 리턴
            emailVerificationRepository.deleteByEmail(email);
            return false;
		}
		// 코드 일치 
		return verificationDTO.getVerificationCode().equals(inputcode);
	}
	
	
	private String generateRandomCode(int length) {
		Random random = new Random();
		int number = random.nextInt((int)Math.pow(10, length));
		return String.format("%0" + length + "d", number);
	}
}
