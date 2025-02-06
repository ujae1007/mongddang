package com.mongddang.backend.user.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mongddang.backend.user.dto.CustomUserDetailsDTO;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.repository.UserRepository;
@Service
public class CustomUserDetailsService implements UserDetailsService {
	
	private final UserRepository userRepository;
	
	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		
		UserDTO userDTO = userRepository.getUserByEmail(email);
		
		if(userDTO != null) {
			return new CustomUserDetailsDTO(userDTO);
		}
		
		throw new UsernameNotFoundException("User not found with email: " + email); // 예외 던지기
	}

}
