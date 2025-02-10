package com.mongddang.backend.search.repository;

import com.mongddang.backend.search.entity.SearchAlbum;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchAlbumRepository extends JpaRepository<SearchAlbum, Integer> {
	List<SearchAlbum> findByTitleContainingAndStatus(String title, boolean status);
}
