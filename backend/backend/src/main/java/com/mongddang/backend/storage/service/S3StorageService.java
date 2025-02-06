package com.mongddang.backend.storage.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import jakarta.annotation.PostConstruct;

@Service
public class S3StorageService {
	@Value("${cloud.aws.s3.bucketName}")
    private String bucketName;
    
    private AmazonS3 amazonS3;
    
    public S3StorageService(AmazonS3 amazonS3) {
    	this.amazonS3 = amazonS3;
    }
    
    // 업로드
    public String uploadFile(MultipartFile file, String folderType) throws IOException{
    	// 파일 타입 검증
    	if (!file.getContentType().startsWith("image/")) {
    		throw new IOException("이미지 파일만 가능합니다.");
    	}
    	
    	// 고유한 파일 이름 생성
    	String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
    	
    	String folderPrefix;
    	
    	if("profile".equals(folderType)) {
    		folderPrefix = "profile";
    	} else if("playlist".equals(folderType)) {
    		folderPrefix = "playlist";
    	} else {
    		// 기본 폴더
    		folderPrefix = "profile";
    	}
    	// "폴더/파일이름" 형식
    	String key = folderPrefix + "/" + uniqueFileName;
    	
    	// 메타데이터 설정
    	ObjectMetadata metadata =new ObjectMetadata();
    	metadata.setContentLength(file.getSize());
    	metadata.setContentType(file.getContentType());	// 이거 안해주면 객체 url 이동시 정적 파일이 보이는 것이 아니라 다운로드 받아짐
    	
    	
    	// S3에 파일 업로드 요청 생성
        PutObjectRequest request = new PutObjectRequest(bucketName, key, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead);
        
        // 파일 업로드 실행
        amazonS3.putObject(request);
        
        // 업로드된 파일의 URL 생성 및 반환
        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s/%s", bucketName, amazonS3.getRegionName(), folderPrefix,uniqueFileName);
        return fileUrl;
    	
    }
    
    // 삭제
    
    public void deleteFile(String folderType, String fileName) {
    	String folderPrefix;
    	
    	if("profile".equals(folderType)) {
    		folderPrefix = "profile";
    	} else if("playlist".equals(folderType)) {
    		folderPrefix = "playlist";
    	} else {
    		// 기본 폴더
    		folderPrefix = "profile";
    	}
    	
    	String key = folderPrefix + "/" + fileName;
    	amazonS3.deleteObject(bucketName, key);
    }
    

    
	
}
