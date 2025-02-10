package com.mongddang.backend.search.controller;

import com.mongddang.backend.search.dto.SearchUserDto;
import com.mongddang.backend.search.dto.SearchAlbumDto;
import com.mongddang.backend.search.service.SearchService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    // 유저 검색: /api/search/users?nickname=검색어
    @GetMapping("/users")
    public ResponseEntity<List<SearchUserDto>> searchUsers(@RequestParam("nickname") String nickname) {
        List<SearchUserDto> users = searchService.searchUsersByNickname(nickname);
        return ResponseEntity.ok(users);
    }

    // 앨범 검색: /api/search/albums?title=검색어
    @GetMapping("/albums")
    public ResponseEntity<List<SearchAlbumDto>> searchAlbums(@RequestParam("title") String title) {
        List<SearchAlbumDto> albums = searchService.searchAlbumsByTitle(title);
        return ResponseEntity.ok(albums);
    }
}
