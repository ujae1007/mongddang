package com.mongddang.backend.search.repository;

import com.mongddang.backend.search.entity.SearchUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchUserRepository extends JpaRepository<SearchUser, Integer> {
    List<SearchUser> findByNicknameContaining(String nickname);
}
