package com.mongddang.backend.album.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class FastAPIService {
    private final RestTemplate restTemplate;

    public FastAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * FastAPI로 노래 장르 리스트 전송 후 표지 이미지 URL 반환
     */
    public String callFastAPI(List<String> genres) {
        String fastApiUrl = "http://fastapi:8000/generate-cover/";

        // FastAPI에 보낼 JSON 데이터 생성
        Map<String, Object> payload = Map.of("genres", genres);

        // FastAPI 호출 및 JSON 데이터 전송
        ResponseEntity<Map> response = restTemplate.postForEntity(fastApiUrl, payload, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return (String) response.getBody().get("image_url"); // FastAPI가 생성한 표지 이미지 URL 반환
        } else {
            throw new RuntimeException("FastAPI 호출 실패: " + response.getStatusCode());
        }
    }
}
