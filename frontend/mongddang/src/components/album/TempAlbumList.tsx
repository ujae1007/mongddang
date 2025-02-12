import { Album } from "../../types";

interface TempAlbumListProps {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
  onBack: () => void;
}

function TempAlbumList({ albums, onSelectAlbum, onBack }: TempAlbumListProps) {
  return (
    <div>
      <h2>임시저장 앨범 목록</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            <span>{album.id}</span>
            <a onClick={() => onSelectAlbum(album)}>{album.title}</a>
          </li>
        ))}
      </ul>
      <button onClick={onBack}>뒤로가기</button>
    </div>
  );
}

export default TempAlbumList;
