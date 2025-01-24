package com.mongddang.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	// 암호화
	@Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// csrf 비활성화
		http
			.csrf((auth) -> auth.disable());
		
		//From 로그인 방식 disable
        http
        	.formLogin((auth) -> auth.disable());

		//http basic 인증 방식 disable
        http
            .httpBasic((auth) -> auth.disable());
        
        // 접근 허용 및 인증 절차
        http
        	.authorizeHttpRequests((auth) -> auth
                    .requestMatchers("/api/auth/**", "/", "/api/auth/login").permitAll()
                    .anyRequest().authenticated());
        
        //세션 stateless 상태로 변경
        http
        .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		return http.build();
	}
}
