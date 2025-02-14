// 프로필페이지에 사용되는 하나의 앨범 컴포넌트 
import { MyAlbum } from "../../pages/user/ProfilePage"
import './AlbumCard.css'
interface AlbumCardProps {
  album: MyAlbum
}

const AlbumCard = ({album}:AlbumCardProps) =>  {
  return (
    <div className="albumCardWrap">
      <img src={album.albumImageURL} />
      <div className="Container">
        <div className="Title">{album.title}</div>
        <div className="CreatedAt">{new Date(album.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  )
}

export default AlbumCard