package com.mongddang.backend.album.mapper;

import com.mongddang.backend.album.dto.AlbumResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AlbumMapper {

    List<AlbumResponseDto> findAll();
    AlbumResponseDto findById(@Param("albumId") int albumId);
    void insertAlbum(AlbumResponseDto albumDto);
    void updateAlbum(AlbumResponseDto albumDto);
    void deleteAlbum(@Param("albumId") int albumId);
}
