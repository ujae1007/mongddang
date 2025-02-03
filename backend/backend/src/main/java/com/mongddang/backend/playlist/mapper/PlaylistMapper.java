package com.mongddang.backend.playlist.mapper;

import com.mongddang.backend.playlist.dto.PlaylistDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlaylistMapper {

    List<PlaylistDto> findAll();
    PlaylistDto findById(@Param("playlistId") int playlistId);
    void insertPlaylist(PlaylistDto dto);
    void updatePlaylist(PlaylistDto dto);
    void deletePlaylist(@Param("playlistId") int playlistId);
}
