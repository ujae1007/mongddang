package com.mongddang.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId; // 'user_id'
	
	@Column(nullable = false, unique = true)
	private String email; // 사용자의 이메일, 고유해야 함
	    
	@Column(nullable = false)
	private String password; // 암호화된 비밀번호
	    
	@Column(nullable = false)
	private String nickname; // 닉네임
	
	@Column(name = "like_region_1") // 데이터베이스 컬럼과 명시적으로 매핑
    private String likeRegion1;
	
	@Column(name = "like_region_2") // 데이터베이스 컬럼과 명시적으로 매핑
    private String likeRegion2;
	
	@Column(name = "like_region_3") // 데이터베이스 컬럼과 명시적으로 매핑
    private String likeRegion3;
	
	@Column(name = "like_genre_1") // 데이터베이스 컬럼과 명시적으로 매핑
    private String likeGenre1;
	
	@Column(name = "like_genre_2") // 데이터베이스 컬럼과 명시적으로 매핑
    private String likeGenre2;
	
	@Column(name = "like_genre_3") // 데이터베이스 컬럼과 명시적으로 매핑
    private String likeGenre3;
	
	@Column(name = "profile_image_URL")
	private String profileImageURL;
	
	@Column(name = "introduce")
	private String introduce;

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

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

	public void setLikeGenre2(String likeGener2) {
		this.likeGenre2 = likeGener2;
	}

	public String getLikeGenre3() {
		return likeGenre3;
	}

	public void setLikeGenre3(String likeGenre3) {
		this.likeGenre3 = likeGenre3;
	}

	public String getProfileImageURL() {
		return profileImageURL;
	}

	public void setProfileImageURL(String profileImageURL) {
		this.profileImageURL = profileImageURL;
	}

	public String getIntroduce() {
		return introduce;
	}

	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
}
