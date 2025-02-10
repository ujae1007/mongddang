package com.mongddang.backend.search.service;

import com.mongddang.backend.search.dto.SearchUserDto;
import com.mongddang.backend.search.dto.SearchAlbumDto;
import com.mongddang.backend.search.entity.SearchUser;
import com.mongddang.backend.search.entity.SearchAlbum;
import com.mongddang.backend.search.repository.SearchUserRepository;
import com.mongddang.backend.search.repository.SearchAlbumRepository;
import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {

    private SearchUserRepository searchUserRepository;
    private SearchAlbumRepository searchAlbumRepository;

    public SearchService(SearchUserRepository searchUserRepository, SearchAlbumRepository searchAlbumRepository) {
        this.searchUserRepository = searchUserRepository;
        this.searchAlbumRepository = searchAlbumRepository;
    }

    // 유저 검색: 닉네임에 포함된 문자열로 검색
    @Transactional(readOnly = true)
    public List<SearchUserDto> searchUsersByNickname(String nickname) {
        List<SearchUserDto> result = new ArrayList<SearchUserDto>();
        if (nickname == null || nickname.trim().isEmpty()) {
            return result;
        }
        List<SearchUser> users = searchUserRepository.findByNicknameContaining(nickname);
        for (SearchUser user : users) {
            SearchUserDto dto = new SearchUserDto(user.getUserId(), user.getNickname(), user.getProfileImageURL());
            result.add(dto);
        }
        return result;
    }

    // 앨범 검색: 제목에 포함된 문자열로 검색
    @Transactional(readOnly = true)
    public List<SearchAlbumDto> searchAlbumsByTitle(String title) {
        List<SearchAlbumDto> result = new ArrayList<SearchAlbumDto>();
        if (title == null || title.trim().isEmpty()) {
            return result;
        }
        // status가 true인 조건 추가
        List<SearchAlbum> albums = searchAlbumRepository.findByTitleContainingAndStatus(title, true);
        for (SearchAlbum album : albums) {
            SearchAlbumDto dto = new SearchAlbumDto(
                    album.getAlbumId(),
                    album.getTitle(),
                    album.getAlbumImageURL(),
                    album.isStatus(),
                    album.getCreatedAt()
            );
            result.add(dto);
        }
        return result;
    }
}
