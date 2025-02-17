package com.mongddang.backend.album.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "`like`")  // ✅ MySQL 예약어 충돌 방지
@Getter
@NoArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")  // ✅ DB의 `like_id` 컬럼과 매핑
    private Integer likeId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "album_id", nullable = false)
    private Integer albumId;

    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;

    public Like(Integer userId, Integer albumId) {
        this.userId = userId;
        this.albumId = albumId;
    }
}
