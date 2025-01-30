package com.mongddang.backend.user.dto;

import org.springframework.web.multipart.MultipartFile;

public class SignupRequestDTO {

	private String email;
	private String password;
	private String nickname;
	private String likeRegion1;
    private String likeRegion2;
 
	private String likeRegion3;

    private String likeGenre1;
    private String likeGenre2;
    private String likeGenre3;

    private MultipartFile profileImage; // 프로필 이미지 파일 (옵셔널)
    private String introduce;
    
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
    public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getLikeRegion1() {
		return likeRegion1;
	}
	public void setLikeRegion1(String likeRegion1) {
		this.likeRegion1 = likeRegion1;
	}
	public String getLikeRegion2() {
		return likeRegion2;
	}
	public void setLikeRegion2(String likeRegion2) {
		this.likeRegion2 = likeRegion2;
	}
	public String getLikeRegion3() {
		return likeRegion3;
	}
	public void setLikeRegion3(String likeRegion3) {
		this.likeRegion3 = likeRegion3;
	}
	public String getLikeGenre1() {
		return likeGenre1;
	}
	public void setLikeGenre1(String likeGenre1) {
		this.likeGenre1 = likeGenre1;
	}
	public String getLikeGenre2() {
		return likeGenre2;
	}
	public void setLikeGenre2(String likeGenre2) {
		this.likeGenre2 = likeGenre2;
	}
	public String getLikeGenre3() {
		return likeGenre3;
	}
	public void setLikeGenre3(String likeGenre3) {
		this.likeGenre3 = likeGenre3;
	}
	public MultipartFile getProfileImage() {
		return profileImage;
	}
	public void setProfileImage(MultipartFile profileImage) {
		this.profileImage = profileImage;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
    
}
