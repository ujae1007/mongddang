package com.mongddang.backend.playlist.controller;

import com.mongddang.backend.playlist.dto.PlaylistDto;
import com.mongddang.backend.playlist.entity.Playlist;
import com.mongddang.backend.playlist.service.PlaylistService;
import com.mongddang.backend.user.dto.UserDTO;
import com.mongddang.backend.user.service.UserService;

import java.math.BigDecimal;
import java.util.List;
import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    private final PlaylistService playlistService;
    private final UserService userService; 

    public PlaylistController(PlaylistService playlistService, UserService userService) {
        this.playlistService = playlistService;
        this.userService = userService;
    }
    // 플레이리스트 생성 시, 현재 로그인한 사용자가 앨범의 소유자인지 확인
    @PostMapping("/{albumId}")
    public ResponseEntity<Playlist> createPlaylist(Principal principal, @PathVariable("albumId") int albumId) {
        String email = principal.getName();
        UserDTO userDTO = userService.getUserByEmail(email);
        int userId = userDTO.getUserId();
        Playlist createdPlaylist = playlistService.createPlaylist(albumId, userId);
        return ResponseEntity.ok(createdPlaylist);
    }
    
    // 플레이리스트 수정 시, 현재 로그인한 사용자가 해당 앨범의 소유자인지 확인
    @PutMapping(value = "/{playlistId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updatePlaylist(
            Principal principal,
            @PathVariable("playlistId") int playlistId,
            @RequestParam("startTime") int startTime,
            @RequestParam("endTime") int endTime,
            @RequestParam("latitude") BigDecimal latitude,
            @RequestParam("longitude") BigDecimal longitude,
            @RequestParam("locationAddress") String locationAddress,
            @RequestParam("musicId") int musicId,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) { // 파일은 @RequestPart 유지

        try {
            String email = principal.getName();
            UserDTO userDTO = userService.getUserByEmail(email);
            int userId = userDTO.getUserId();

            // 컨트롤러에서 DTO 객체 생성
            PlaylistDto dto = new PlaylistDto();
            dto.setStartTime(startTime);
            dto.setEndTime(endTime);
            dto.setLatitude(latitude);
            dto.setLongitude(longitude);
            dto.setLocationAddress(locationAddress);
            dto.setMusicId(musicId);

            // DTO, 파일, 그리고 현재 사용자 ID를 함께 서비스로 전달
            Playlist updatedPlaylist = playlistService.updatePlaylist(playlistId, dto, files, userId);
            return ResponseEntity.ok(new PlaylistDto(updatedPlaylist));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // 플레이리스트 삭제 시, 현재 로그인한 사용자가 해당 앨범의 소유자인지 확인
    @DeleteMapping("/{playlistId}")
    public ResponseEntity<String> deletePlaylist(Principal principal, @PathVariable("playlistId") int playlistId) {
        String email = principal.getName();
        UserDTO userDTO = userService.getUserByEmail(email);
        int userId = userDTO.getUserId();
        playlistService.deletePlaylist(playlistId, userId);
        return ResponseEntity.ok("Playlist 삭제 완료");
    }
}

