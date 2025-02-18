package com.mongddang.backend.album.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FastAPIService {
    private final RestTemplate restTemplate;

    public FastAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // FastAPI로 노래 장르 리스트, 이미지 리스트 전송 후 표지 이미지 URL 반환

    public String getAlbumImg(List<String> genres, List<String> imageUrls) {
        String fastApiUrl = "http://127.0.0.1:8000/generate_cover";

        // FastAPI에 보낼 JSON 데이터 생성
        Map<String, Object> payload = Map.of("genres", genres, "imageUrls",imageUrls);

        // FastAPI 호출 및 JSON 데이터 전송
        ResponseEntity<Map> response = restTemplate.postForEntity(fastApiUrl, payload, Map.class);

        // HTTP 응답 코드 확인
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            // FastAPI 응답 확인용 로그
            System.out.println("FastAPI 응답 데이터: " + response.getBody());

            // FastAPI 응답에서 "imageUrl" 또는 "image_url"을 찾기
            Object imageUrlObj = response.getBody().get("imageUrl"); // FastAPI 응답 키가 "imageUrl"인지 확인
            if (imageUrlObj == null) {
                imageUrlObj = response.getBody().get("image_url"); // "image_url" 형식일 수도 있으므로 확인
            }

            // imageUrl이 String인지 확인하고 반환
            return (imageUrlObj instanceof String) ? (String) imageUrlObj : null;
        } else {
            throw new RuntimeException("FastAPI 호출 실패: " + response.getStatusCode());
        }

    }
    
    // FastAPI로 현재 로그인한 사용자 선호 지역, 장르 전송 후 추천 앨범 id 반환
    
    public List<Integer> getRecommendedAlbumIds(int userId, String likeRegion1, String likeRegion2, String likeRegion3, 
    		String likeGenre1, String likeGenre2, String likeGenre3) {
        String fastApiUrl = "http://127.0.0.1:8000/recommendation";

        // JSON 데이터 생성
        Map<String, Object> payload = Map.of(
                "user_id", userId,
                "like_region1", likeRegion1,
                "like_region2", likeRegion2,
                "like_region3", likeRegion3,
                "like_genre1", likeGenre1,
                "like_genre2", likeGenre2,
                "like_genre3", likeGenre3
        );

        // FastAPI 호출 및 JSON 데이터 전송
        ResponseEntity<Map> response = restTemplate.postForEntity(fastApiUrl, payload, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            System.out.println("FastAPI 응답 데이터: " + response.getBody());

            // FastAPI 응답에서 "recommended_album_ids" 키 값을 가져옴
            Object albumIdsObj = response.getBody().get("recommendation_albums");

            // albumIdsObj가 리스트 형태인지 확인 후 변환
            if (albumIdsObj instanceof List<?>) {
                return ((List<?>) albumIdsObj).stream()
                        .filter(id -> id instanceof Integer)
                        .map(id -> (Integer) id)
                        .collect(Collectors.toList());
            }
        }
        throw new RuntimeException("FastAPI 추천 앨범 호출 실패: " + response.getStatusCode());
    }
 
    
    
}
