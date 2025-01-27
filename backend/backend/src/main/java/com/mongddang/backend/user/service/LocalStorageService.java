package com.mongddang.backend.user.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalStorageService {
	@Value("${file.storage.location}")
	private String storageLocation; // 로컬 저장소 경로
	
	public String uploadFile(MultipartFile file) throws IOException{
		// 파일 타입 검증 
		if(!file.getContentType().startsWith("image/")) {
			throw new IOException("이미지 파일만 가능합니다.");
		}
		
		// 고유한 파일 이름 생성
		String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
		
		// 파일 저장 경로 설정
		String filePath = Paths.get(storageLocation, uniqueFileName).toString();
		
		// 파일 저장
		File dest = new File(filePath);
		file.transferTo(dest);
		
        // 파일의 로컬 URL 반환 (예: http://localhost:8080/images/{uniqueFileName})
        // 추후 S3로 교체 시 해당 부분을 주석 처리하고 S3 업로드 코드를 활성화
        String fileUrl = "/images/" + uniqueFileName;
        
		/*
		추후 s3 주소를 알게 되면 변경 
		String imageUrl = s3Service.uploadFile(file); // S3에 파일 업로드 후 URL 반환
		return imageUrl;
		*/
        return fileUrl;
	}
}
