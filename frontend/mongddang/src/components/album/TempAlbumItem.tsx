import { Album } from "../../types";
import "./TempAlbumItem.css";

interface TempAlbumItemProps {
  album: Album;
  onClick: (album: Album) => void;
}

function TempAlbumItem({album,onClick}: TempAlbumItemProps) {
  return (
    <div>
      <img src="../assets/지도마커.svg" alt="" />
      {/* a태그로 하려했는데 button 사용을 권장한다네요 */}
      {/* 배경을 없애고 글씨만 보이게,, 하고 싶어요 */}
      <button onClick={() => onClick(album)}>
        {album.title}
      </button>
    </div>
  );
}

export default TempAlbumItem;