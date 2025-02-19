import React from "react";
import { Album } from "../../types";
import TempAlbumItem from "./TempAlbumItem";
import "./TempAlbumList.css"; // CSS 파일 임포트

interface TempAlbumListProps {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
  onBack: () => void;
}

function TempAlbumList({ albums, onSelectAlbum, onBack }: TempAlbumListProps) {
  return (
    <div className="temp-album-list-container">
      {/* 헤더 부분 */}
      <div className="temp-album-list-header">
        <img
          src="../assets/뒤로가기.svg"
          alt="뒤로가기"
          onClick={onBack}
        />
        <h2 className="temp-album-list-title">임시저장 앨범 목록</h2>
      </div>

      {/* 앨범 커버 이미지 */}
      <img
        className="temp-album-cover"
        src="../assets/앨범커버생성전.png"
        alt="앨범 커버 생성 전"
      />

      {/* 앨범 리스트 */}
      <div className="temp-album-items">
        {albums.length === 0 ? (
          <h3 className="temp-album-no-items">
            임시저장된 앨범이 없습니다.
          </h3>
        ) : (
          albums.map((album) => (
            <TempAlbumItem
              key={album.albumId}
              album={album}
              onClick={onSelectAlbum}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TempAlbumList;
