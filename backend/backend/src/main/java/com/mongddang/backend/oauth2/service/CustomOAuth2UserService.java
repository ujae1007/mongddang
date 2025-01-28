//package com.mongddang.backend.oauth2.service;
//
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.stereotype.Service;
//
//import com.mongddang.backend.oauth2.dto.GoogleResponseDTO;
//import com.mongddang.backend.oauth2.dto.NaverResponseDTO;
//import com.mongddang.backend.oauth2.dto.OAuth2Response;
//import com.mongddang.backend.user.dto.UserDTO;
//
//@Service
//public class CustomOAuth2UserService extends DefaultOAuth2UserService {
//	@Override
//	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
//		OAuth2User oAuth2User = super.loadUser(userRequest);
//		
//		System.out.println(oAuth2User);
//		
//        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // 어떤 서비스인지 확인
//        OAuth2Response oAuth2Response = null;
//        if(registrationId.equals("naver")) {
//            oAuth2Response = new NaverResponseDTO(oAuth2User.getAttributes());
//        } else if (registrationId.equalss("google")) {
//        	oAuth2Response = new GoogleResponseDTO(oAuth2User.getAttributes());
//        } else {
//        	return null;
//        }
//        
//        String email = oAuth2Response.getEmail();
//        UserDTO userDTO = new UserDTO();
//        userDTO.setEmail(email);
//        userDTO.setPassword("moddangpassword");
//        return new CustomOAuth2User(userDTO);
//	}
//}
//
