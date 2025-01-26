package com.mongddang.backend.user.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


public class CustomUserDetailsDTO implements UserDetails{
	
	private final UserDTO userDTO;
	
	public CustomUserDetailsDTO(UserDTO userDTO) {
		this.userDTO = userDTO;
	}
	
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	
		
		return Collections.emptyList();
	}

	@Override
	public String getPassword() {
//		System.out.println(userDTO.getPassword());
		return userDTO.getPassword();
	}

	@Override
	public String getUsername() {
//		System.out.println(userDTO.getEmail());
		return userDTO.getEmail();
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true; // 계정 만료 여부
	}
	
	@Override
	public boolean isAccountNonLocked() {
		return true; // 계정 잠금 여부
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true; // 자격 증명 만료 여부
	}
	
	@Override
	public boolean isEnabled() {
		return true; // 계정 활성화 여부
	}

}
