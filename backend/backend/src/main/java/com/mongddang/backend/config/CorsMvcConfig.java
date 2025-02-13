package com.mongddang.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
                // .allowedOrigins("http://localhost:5173");
                .allowedOrigins(
                        "http://localhost:5173", // 프론트엔드 (Vue.js 등)
                        "http://127.0.0.1:8000" // FastAPI 서버 추가
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키 허용 (필요 시)
    }
}
