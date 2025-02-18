import { Album } from "../../types";
import TempAlbumItem from "./TempAlbumItem";

interface TempAlbumListProps {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
  onBack: () => void;
}

function TempAlbumList({ albums, onSelectAlbum, onBack }: TempAlbumListProps) {

  return (
    <div>
      <div style={{display:"flex"}}>
        <img 
          src="../assets/뒤로가기.svg" 
          alt="뒤로가기기" 
          onClick={onBack}
        />
        <h2>임시저장 앨범 목록</h2>
      </div>

      <div>
        <img src="../assets/앨범커버생성전.png" alt="앨범 커버 생성 전" />
      </div>

      <div>
        {albums.length === 0 ? (
          <h3>임시저장된 앨범이 없습니다.</h3>) : (
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
