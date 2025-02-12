// 프로필페이지에 사용되는 하나의 앨범 컴포넌트 
import { MyAlbum } from "../../pages/user/ProfilePage"

interface AlbumCardProps {
  album: MyAlbum
}

const AlbumCard = ({album}:AlbumCardProps) =>  {
  return (
    <div className="albumCardWrap">
      <img src={album.albumImageURL} width={100} />
      <p>{album.title}</p>
      <p>{new Date(album.createdAt).toLocaleDateString()}</p>
    </div>
  )
}

export default AlbumCard