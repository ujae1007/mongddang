package com.mongddang.backend.config;

import java.util.List;

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
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mongddang.backend.jwt.JWTFilter;
import com.mongddang.backend.jwt.JWTUtil;
import com.mongddang.backend.jwt.LoginFilter;
import com.mongddang.backend.jwt.service.RefreshTokenService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${FRONTEND_URL2}")
    private String frontendUrl2;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ✅ CORS 설정 추가
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ✅ CSRF 비활성화 (프론트-백 분리 환경)
            .csrf(csrf -> csrf.disable())

            // ✅ 기본 로그인 방식 비활성화
            .formLogin(form -> form.disable())

            // ✅ HTTP 기본 인증 방식 비활성화
            .httpBasic(basic -> basic.disable())

            // ✅ 기본 LogoutFilter 비활성화 (JWT 기반 인증에서는 필요 없음)
            .logout(logout -> logout.disable())

            // ✅ 접근 허용 및 인증 설정
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/api/**", "/api/auth/login", "/api/auth/sendemail",
                                 "/api/auth/verifycode", "/api/auth/reissue", "/api/auth/logout","/api/ai/**")
                .permitAll()
                .anyRequest().authenticated()
            )

            // ✅ JWT 필터 추가
            .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class)
            .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, refreshTokenService),
                         UsernamePasswordAuthenticationFilter.class)

            // ✅ 세션 stateless 상태로 변경 (JWT 사용 시 필수)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    // ✅ CORS 설정 추가
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin(frontendUrl);
        configuration.addAllowedOrigin(frontendUrl2);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드
        configuration.setAllowedHeaders(List.of("Content-Type","Authorization")); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 쿠키 및 인증 정보 허용

        // CORS 설정을 모든 경로에 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);  // 여기서 모든 경로에 적용

        return source;
    }
}
