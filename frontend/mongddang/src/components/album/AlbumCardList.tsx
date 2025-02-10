// 프로필 페이지에서 사용된는 앨범들을 모아놓은 앨범 리스트 컴포넌트 

import React from "react";
import AlbumCard from "./AlbumCard";
import { MyAlbum } from "../../pages/user/ProfilePage";

interface AlbumListProps {
  albums: MyAlbum[]
}

const AlbumList: React.FC<AlbumListProps> = ({albums}) => {

  return (
    <div>
      {albums.map((album) => (
        <AlbumCard 
          key={album.albumId}
          album={album}
        />
      ))}
    </div>
  )
}

export default AlbumList