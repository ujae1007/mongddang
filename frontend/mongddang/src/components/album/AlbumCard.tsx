// 프로필페이지에 사용되는 하나의 앨범 컴포넌트 
import { MyAlbum } from "../../pages/user/ProfilePage"
import './AlbumCard.css'
import { useNavigate } from "react-router-dom"

interface AlbumCardProps {
  album: MyAlbum
}

const AlbumCard = ({album}:AlbumCardProps) =>  {

  const nav = useNavigate()

  const albumId = album.albumId

  const goToAlbumDetail = () => {
    console.log("앨범 Id의 값: ", albumId)
    nav(`/albums/${albumId}`)
  }

  return (
    <div 
      className="albumCardWrap"
      onClick={goToAlbumDetail}
      >
      <img src={album.albumImageURL} />
      <div className="Container">
        <div className="Title">{album.title}</div>
        <div className="CreatedAt">{new Date(album.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  )
}

export default AlbumCard