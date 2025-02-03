package com.mongddang.backend.playlist.service;

import com.mongddang.backend.album.entity.Album;
import com.mongddang.backend.album.repository.AlbumRepository;
import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.playlist.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final AlbumRepository albumRepository;

    public PlaylistService(PlaylistRepository playlistRepository, AlbumRepository albumRepository) {
        this.playlistRepository = playlistRepository;
        this.albumRepository = albumRepository;
    }

    @Transactional
    public Playlist createPlaylist(int albumId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid albumId"));
        Playlist playlist = new Playlist(album);
        return playlistRepository.save(playlist);
    }
    @Transactional
    public Playlist updatePlaylist(int playlistId, PlaylistDto dto) {
        Playlist playlist = playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId: " + playlistId));

        playlist.setStartTime(dto.getStartTime());
        playlist.setEndTime(dto.getEndTime());
        playlist.setLocationAddress(dto.getLocationAddress());
        playlist.setMusicId(dto.getMusicId());  // ✅ musicId만 저장하도록 변경

        playlistRepository.save(playlist);  

        return playlistRepository.findById(playlistId)
            .orElseThrow(() -> new IllegalStateException("Failed to fetch updated playlist"));
    }


//    @Transactional
//    public Playlist updatePlaylist(int playlistId, PlaylistDto dto) {
//        Playlist playlist = playlistRepository.findById(playlistId)
//            .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId: " + playlistId));
//
//        playlist.setStartTime(dto.getStartTime());
//        playlist.setEndTime(dto.getEndTime());
//        playlist.setLocationAddress(dto.getLocationAddress());
//        playlist.setMusicId(dto.getMusicId());
//
//        playlistRepository.save(playlist);  // 🔥 먼저 저장
//
//        return playlistRepository.findById(playlistId).orElseThrow(() -> 
//            new IllegalStateException("Failed to fetch updated playlist"));  // 🔥 다시 조회해서 반환
//    }

//    @Transactional
//    public Playlist updatePlaylist(int playlistId, PlaylistDto dto) {
//        Playlist playlist = playlistRepository.findById(playlistId)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid playlistId"));
//
//        playlist.setMusicId(dto.getMusicId()); // 🚀 music_id 직접 저장
//        playlist.setStartTime(dto.getStartTime());
//        playlist.setEndTime(dto.getEndTime());
//        playlist.setLocationAddress(dto.getLocationAddress());
//
//        return playlistRepository.save(playlist);
//    }
}

