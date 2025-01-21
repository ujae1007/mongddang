package com.example.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springjwt.entitity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
	Boolean existsByUsername(String username);
	
	// username을 받아 DB에서 회원을 조회하는 메소드 작성
	UserEntity findByUsername(String username);
}
