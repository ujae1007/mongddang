package com.mongddang.backend.search.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "`user`") // DB 생성 스크립트에 맞게 백틱 사용
public class SearchUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String nickname;
    
    @Column(name = "like_region1")
    private String likeRegion1;
    
    @Column(name = "like_region2")
    private String likeRegion2;
    
    @Column(name = "like_region3")
    private String likeRegion3;
    
    @Column(name = "like_genre1")
    private String likeGenre1;
    
    @Column(name = "like_genre2")
    private String likeGenre2;
    
    @Column(name = "like_genre3")
    private String likeGenre3;
    
    @Column(name = "profile_image_URL")
    private String profileImageURL;
    
    @Column(columnDefinition = "TEXT")
    private String introduce;

    // 기본 생성자
    public SearchUser() {}

    // Getter 및 Setter
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
    public void setLikeGenre2(String likeGenre2) {
        this.likeGenre2 = likeGenre2;
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
