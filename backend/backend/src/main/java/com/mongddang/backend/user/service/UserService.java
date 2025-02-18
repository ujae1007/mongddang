 package com.mongddang.backend.user.service;

import java.nio.file.attribute.UserPrincipalNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.mongddang.backend.storage.service.S3StorageService;
import com.mongddang.backend.user.dto.SignupRequestDTO;
import com.mongddang.backend.user.dto.UpdateUserDTO;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.repository.UserRepository;



@Service
public class UserService {
	
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final S3StorageService s3StorageService; // 추후 s3로 수정
	
	@Value("${default.profile.image.url}")
    private String defaultProfileImageUrl; // 수정: 기본 이미지 URL 주입
	
	public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, S3StorageService s3StorageService) {
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
		this.s3StorageService = s3StorageService;
		
	}
	
	// 존재하는 이메일인지 확인
	public boolean isExistsEmail(String email) throws Exception {
		int cnt = userRepository.existsByEmail(email);
		return cnt >= 1;
	}
	
	
	// 회원가입
	@Transactional
	public boolean signUp(SignupRequestDTO signupRequestDTO) throws Exception {
		int cnt = userRepository.existsByEmail(signupRequestDTO.getEmail());
		if (cnt >= 1) {
			throw new Exception("이미 사용 중인 이메일입니다.");
		} 
		// 2. 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(signupRequestDTO.getPassword());
        
        // 사용자 정보 설정
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(signupRequestDTO.getEmail());
        userDTO.setPassword(encodedPassword);
        userDTO.setNickname(signupRequestDTO.getNickname());
        userDTO.setLikeRegion1(signupRequestDTO.getLikeRegion1());
        userDTO.setLikeRegion2(signupRequestDTO.getLikeRegion2());
        userDTO.setLikeRegion3(signupRequestDTO.getLikeRegion3());
        userDTO.setLikeGenre1(signupRequestDTO.getLikeGenre1());
        userDTO.setLikeGenre2(signupRequestDTO.getLikeGenre2());
        userDTO.setLikeGenre3(signupRequestDTO.getLikeGenre3());
        userDTO.setIntroduce(signupRequestDTO.getIntroduce());
        
        //프로필 이미지 업로드 처리 (S3 저장)
        MultipartFile profileimage = signupRequestDTO.getProfileImage();
        if(profileimage != null && !profileimage.isEmpty()) {
        	String imageUrl = s3StorageService.uploadFile(profileimage, "profile");
        	userDTO.setProfileImageURL(imageUrl);
        } else {
        	// 프로필 이미지을 업로드 하지 않을 경우 defaultimage
            userDTO.setProfileImageURL(defaultProfileImageUrl);
        }
        
        // 사용자 등록
        return userRepository.insertUser(userDTO) == 1;
	}
	
	// 회원정보 수정 
	@Transactional
	public boolean updateUser(String email, UpdateUserDTO updateUserDTO) throws Exception {
		UserDTO currentUser = userRepository.getUserByEmail(email);
		if (currentUser == null) {
			throw new UserPrincipalNotFoundException("사용자 정보를 찾을 수 없다");
		}
		// 수정
		if(updateUserDTO.getNickname() != null) {
			currentUser.setNickname(updateUserDTO.getNickname());
		}
		if(updateUserDTO.getLikeRegion1() != null) {
			currentUser.setLikeRegion1(updateUserDTO.getLikeRegion1());
		}
		if(updateUserDTO.getLikeRegion2() != null) {
			currentUser.setLikeRegion2(updateUserDTO.getLikeRegion2());
		}
		if(updateUserDTO.getLikeRegion3() != null) {
			currentUser.setLikeRegion3(updateUserDTO.getLikeRegion3());
		}
		if(updateUserDTO.getLikeGenre1() != null) {
			currentUser.setLikeGenre1(updateUserDTO.getLikeGenre1());
		}
		if(updateUserDTO.getLikeGenre2() != null) {
			currentUser.setLikeGenre2(updateUserDTO.getLikeGenre2());
		}
		if(updateUserDTO.getLikeGenre3() != null) {
			currentUser.setLikeGenre3(updateUserDTO.getLikeGenre3());
		}
		if(updateUserDTO.getIntroduce() != null) {
			currentUser.setIntroduce(updateUserDTO.getIntroduce());
		}
		
		// 프로필 이미지 업로드 처리 (선택적)
		MultipartFile profileImage = updateUserDTO.getProfileImage();
		if(profileImage != null && !profileImage.isEmpty()) {
			String imageUrl = s3StorageService.uploadFile(profileImage, "profile");
			currentUser.setProfileImageURL(imageUrl);
		} // 업로드하지 않을 경우 기존 이미지 유지
		currentUser.setProfileImageURL(defaultProfileImageUrl);
		// 사용자 정보 업데이트
		int result = userRepository.updateUser(currentUser);
		return result == 1;
			
	}
	
	// 현재 로그인한 사용자 정보 조회
	public UserDTO getUserByEmail(String email) {
		return userRepository.getUserByEmail(email);
	}
	
	// 사용자 ID로 조회 (추가)
	public UserDTO getUserById(int userId) {
	    UserDTO user = userRepository.getUserById(userId);
	    if(user == null) {
	        throw new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + userId);
	    }
	    return user;
	}
	
	//회원탈퇴
	@Transactional
	public boolean signout(String email) {
		return userRepository.deleteUser(email) == 1;
	}
	
	
	
}
