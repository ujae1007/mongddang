package com.mongddang.backend.album.service;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import com.mongddang.backend.album.dto.AlbumRequestDto;
import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.album.repository.AlbumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    @Transactional
    public AlbumResponseDto createAlbum(AlbumRequestDto albumRequestDto) {  
        Album album = new Album(
            albumRequestDto.getUserId(),
            albumRequestDto.getTitle(),
            albumRequestDto.getAlbumImageUrl(),
            albumRequestDto.isStatus()
        );

        Album savedAlbum = albumRepository.save(album);

        return new AlbumResponseDto(
            savedAlbum.getAlbumId(),
            savedAlbum.getUserId(),
            savedAlbum.getTitle(),
            savedAlbum.getAlbumImageUrl(),
            savedAlbum.getViewCount(),
            savedAlbum.isStatus(),
            savedAlbum.getCreatedAt(),
            savedAlbum.getUpdatedAt()
        );
    }
}




//import com.mongddang.backend.album.dto.AlbumResponseDto;
//import com.mongddang.backend.album.entity.Album;
//import com.mongddang.backend.album.mapper.AlbumMapper;
//import com.mongddang.backend.album.repository.AlbumRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//public class AlbumService {
//
//	private final AlbumMapper albumMapper;
//	private final AlbumRepository albumRepository;
//
//	// 생성자 주입
//	public AlbumService(AlbumMapper albumMapper, AlbumRepository albumRepository) {
//		this.albumMapper = albumMapper;
//		this.albumRepository = albumRepository;
//	}
//
//	@Transactional(readOnly = true)
//	public List<AlbumResponseDto> getAllAlbumsMyBatis() {
//		return albumMapper.findAll();
//	}
//
//	@Transactional(readOnly = true)
//	public AlbumResponseDto getAlbumByIdMyBatis(int albumId) {
//		return albumMapper.findById(albumId);
//	}
//
//	@Transactional
//	public void createAlbumMyBatis(AlbumResponseDto albumDto) {
//		albumMapper.insertAlbum(albumDto);
//	}
//
//	@Transactional
//	public void updateAlbumMyBatis(AlbumResponseDto albumDto) {
//		albumMapper.updateAlbum(albumDto);
//	}
//
//	@Transactional
//	public void deleteAlbumMyBatis(int albumId) {
//		albumMapper.deleteAlbum(albumId);
//	}
//
//	
//    @Transactional(readOnly = true)
//    public AlbumResponseDto getAlbumByIdJpa(int albumId) {
//        Optional<Album> optionalAlbum = albumRepository.findById(albumId);
//        if (optionalAlbum.isEmpty()) {
//            return null;
//        }
//        Album album = optionalAlbum.get();
//
//        AlbumResponseDto dto = new AlbumResponseDto();
//        dto.setAlbumId(album.getAlbumId());
//        dto.setUserId(album.getUserId());
//        dto.setTitle(album.getTitle());
//        dto.setAlbumImageUrl(album.getAlbumImageUrl());
//        dto.setViewCnt(album.getViewCnt());
//        dto.setStatus(album.isStatus());
//        dto.setCreatedAt(album.getCreatedAt());
//        dto.setUpdatedAt(album.getUpdatedAt());
//        return dto;
//    }
//
//    @Transactional
//    public void createAlbumJpa(AlbumResponseDto dto) {
//        Album album = dtoToEntity(dto);
//        albumRepository.save(album);
//    }
//
//    @Transactional
//    public void updateAlbumJpa(AlbumResponseDto dto) {
//        Optional<Album> optionalAlbum = albumRepository.findById(dto.getAlbumId());
//        if (optionalAlbum.isPresent()) {
//            Album album = optionalAlbum.get();
//            album.setUserId(dto.getUserId());
//            album.setTitle(dto.getTitle());
//            album.setAlbumImageUrl(dto.getAlbumImageUrl());
//            album.setViewCnt(dto.getViewCnt());
//            album.setStatus(dto.isStatus());
//            albumRepository.save(album);
//        }
//    }
//
//    @Transactional
//    public void deleteAlbumJpa(int albumId) {
//        albumRepository.deleteById(albumId);
//    }
//
//    /** =============== 내부 메서드 =============== **/
//    private Album dtoToEntity(AlbumResponseDto dto) {
//        Album album = new Album();
//        album.setAlbumId(dto.getAlbumId());
//        album.setUserId(dto.getUserId());
//        album.setTitle(dto.getTitle());
//        album.setAlbumImageUrl(dto.getAlbumImageUrl());
//        album.setViewCnt(dto.getViewCnt());
//        album.setStatus(dto.isStatus());
//        return album;
//    }
//}
