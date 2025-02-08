package com.mongddang.backend.playlist.controller;

import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.playlist.service.PlaylistService;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping("/{albumId}")
    public ResponseEntity<Playlist> createPlaylist(@PathVariable("albumId") int albumId) {
        return ResponseEntity.ok(playlistService.createPlaylist(albumId));
    }
    
    @PutMapping(value = "/{playlistId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updatePlaylist(
            @PathVariable("playlistId") int playlistId,
            @RequestParam("startTime") int startTime,
            @RequestParam("endTime") int endTime,
            @RequestParam("latitude") BigDecimal latitude,
            @RequestParam("longitude") BigDecimal longitude,
            @RequestParam("locationAddress") String locationAddress,
            @RequestParam("musicId") int musicId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) { // ✅ 파일은 @RequestPart 유지

        try {
            // ✅ 컨트롤러에서 DTO 객체 생성
            PlaylistDto dto = new PlaylistDto();
            dto.setStartTime(startTime);
            dto.setEndTime(endTime);
            dto.setLatitude(latitude);
            dto.setLongitude(longitude);
            dto.setLocationAddress(locationAddress);
            dto.setMusicId(musicId);

            // ✅ DTO와 파일을 함께 서비스로 전달
            Playlist updatedPlaylist = playlistService.updatePlaylist(playlistId, dto, files);
            return ResponseEntity.ok(new PlaylistDto(updatedPlaylist));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }


//    @PutMapping(value = "/{playlistId}", consumes = "multipart/form-data")
//    public ResponseEntity<?> updatePlaylist(
//            @PathVariable("playlistId") int playlistId,
//            @RequestPart(value = "playlistDto") PlaylistDto dto, // JSON 데이터
//            @RequestPart(value = "files", required = false) List<MultipartFile> files) { // 사진 파일들
//
//        try {
//            if (dto == null) {
//                return ResponseEntity.badRequest().body("Error: playlistDto가 필요합니다.");
//            }
//            Playlist updatedPlaylist = playlistService.updatePlaylist(playlistId, dto, files);
//            return ResponseEntity.ok(new PlaylistDto(updatedPlaylist));
//q
//        } catch (Exception e) {
//            e.printStackTrace(); // 서버 로그에 오류 출력
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error: " + e.getMessage()); // 오류 메시지를 클라이언트에 반환
//        }
//    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<String> deletePlaylist(@PathVariable("playlistId") int playlistId) {
        playlistService.deletePlaylist(playlistId);
        return ResponseEntity.ok("Playlist 삭제 완료");
    }
}