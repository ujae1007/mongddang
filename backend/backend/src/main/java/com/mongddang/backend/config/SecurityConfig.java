package com.mongddang.backend.config;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.mongddang.backend.jwt.JWTFilter;
import com.mongddang.backend.jwt.JWTUtil;
import com.mongddang.backend.jwt.LoginFilter;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {

        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }
	
	// 암호화
	@Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }
	
	// AuthenticationManager bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		//cors 설정
		http
        	.cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000")); //허용할 프론트앤드 서버
                configuration.setAllowedMethods(Collections.singletonList("*"));					// 모든 메서드 허용
                configuration.setAllowCredentials(true);											
                configuration.setAllowedHeaders(Collections.singletonList("*"));
                configuration.setMaxAge(3600L);														//허용할 시간
                configuration.setExposedHeaders(Collections.singletonList("Authorization"));		// Authorization 헤더 허용

                return configuration;
            }
        })));
		
		// csrf 비활성화
		http
			.csrf((auth) -> auth.disable());
		
		//From 로그인 방식 disable -> UsernamePasswordAuthenticationFilter 커스텀 해야됨
        http
        	.formLogin((auth) -> auth.disable());

		//http basic 인증 방식 disable
        http
            .httpBasic((auth) -> auth.disable());
        
        // 접근 허용 및 인증 절차
        http
        	.authorizeHttpRequests((auth) -> auth
                    .requestMatchers("/", "/api/auth/**").permitAll()
                    .anyRequest().authenticated());
        //jwtfilter 등록
        http
        	.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        
        
        http
        	.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class);
        
        //세션 stateless 상태로 변경
        http
        .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		return http.build();
	}
}
