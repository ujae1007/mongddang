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

	public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder,
			S3StorageService s3StorageService) {
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

		// 프로필 이미지 업로드 처리 (S3 저장)
		MultipartFile profileimage = signupRequestDTO.getProfileImage();
		if (profileimage != null && !profileimage.isEmpty()) {
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
		boolean flag = false; // 뭔가 하나라도 수정했다면 flag -> true
		// 유저가 정보를 변경했다면 
		if (!updateUserDTO.getNickname().equals(currentUser.getNickname())) {
			currentUser.setNickname(updateUserDTO.getNickname());
			flag = true;
		}
		if (!updateUserDTO.getLikeRegion1().equals(currentUser.getLikeRegion1())) {
			currentUser.setLikeRegion1(updateUserDTO.getLikeRegion1());
			flag = true;
		}
		if (!updateUserDTO.getLikeRegion2().equals(currentUser.getLikeRegion2())) {
			currentUser.setLikeRegion2(updateUserDTO.getLikeRegion2());
			flag = true;
		}
		if (!updateUserDTO.getLikeRegion3().equals(currentUser.getLikeRegion3())) {
			currentUser.setLikeRegion3(updateUserDTO.getLikeRegion3());
			flag = true;
		}
		if (!updateUserDTO.getLikeGenre1().equals(currentUser.getLikeGenre1())) {
			currentUser.setLikeGenre1(updateUserDTO.getLikeGenre1());
			flag = true;
		}
		if (!updateUserDTO.getLikeGenre2().equals(currentUser.getLikeGenre2())) {
			currentUser.setLikeGenre2(updateUserDTO.getLikeGenre2());
			flag = true;
		}
		if (!updateUserDTO.getLikeGenre3().equals(currentUser.getLikeGenre3())) {
			currentUser.setLikeGenre3(updateUserDTO.getLikeGenre3());
			flag = true;
		}
		if (!updateUserDTO.getIntroduce().equals(currentUser.getIntroduce())) {
			currentUser.setIntroduce(updateUserDTO.getIntroduce());
			flag = true;
		}

		// 프로필 이미지 업로드 처리
		MultipartFile profileImage = updateUserDTO.getProfileImage();
		// 새로운 이미지를 줬다면
		if (profileImage != null && !profileImage.isEmpty()) {
			String imageUrl = s3StorageService.uploadFile(profileImage, "profile");
			currentUser.setProfileImageURL(imageUrl);
		} else {
			// 이미지를 주지 않았다면 null인 경우
			// 원래 잇던 사람이 안줬을 수도 있고(사진 삭제) -> 이때는 defaulimageurl 주소를 넣어주면 됨 
			// 또는 원래 있었는데 다른 것만 수정한 사람도 null 로 보내줌 -> 이때는 현재 저장된 사용자의 정보를 바꾸면 안됨
			
			// 프로필 이미지가 있었지만 다른 정보만 수정하느라 회원 수정 요청을 보낼 경우 -> 그대로 유지
			if (!currentUser.getProfileImageURL().equals(defaultProfileImageUrl) && flag ) {
				currentUser.setProfileImageURL(currentUser.getProfileImageURL());
				// 프로필 이미지가 있었지만 사진만 삭제한 경우 
			} else if (!currentUser.getProfileImageURL().equals(defaultProfileImageUrl) && !flag) {
				currentUser.setProfileImageURL(defaultProfileImageUrl);
				// 프로필 이미지가 있었지만 사진을 삭제하고 다른 정보도 수정한 경우
			} else if (!currentUser.getProfileImageURL().equals(defaultProfileImageUrl) && flag) {
				currentUser.setProfileImageURL(defaultProfileImageUrl);
			} 
		}
		
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
