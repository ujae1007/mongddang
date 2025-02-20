package com.mongddang.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Value("${FRONTEND_URL2}")
    private String frontendUrl2;

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/api/**")
                .allowedOrigins(frontendUrl)
                .allowedOrigins(frontendUrl2)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키 허용 (필요 시)
    }
}
