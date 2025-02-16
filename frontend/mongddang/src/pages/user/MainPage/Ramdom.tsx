import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import './Random.css'

interface Album {
  albumId: number;
  userId: number;
  title: string;
  albumImageUrl: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  playlists: Playlist[];
}

interface Playlist {
  playlistId: number;
  albumId: number;
  musicId: number;
  startTime: number;
  endTime: number;
  latitude: number;
  longitude: number;
  locationAddress: string;
  photoUrls: string[];
  musicDetails: MusicDetails[];
}

interface MusicDetails {
  musicId: number;
  trackName: string;
  artistName: string;
  genre: string;
  popularity: number;
}

interface UserProps {
  loggedInUser: string;
}

function RamdomSection({loggedInUser}: UserProps) {

  const nav = useNavigate()
  
  //현재 재생될 앨범
  const [album, setAlbum] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 앨범 목록 가져오기
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!loggedInUser) return
      setIsLoading(true)
      
      try {
        const res = await axiosInstance.get('/albums/my')
        setAlbum(res.data)
        setIsLoading(false)
        console.log("랜덤 앨범 목록 불러오기 성공:", res.data)
      } catch (err) {
        console.log("랜덤 앨범 목록 불러오기 실패:", err)
      } finally {
        setIsLoading(false)
      }


    }
    fetchAlbums()
  },[loggedInUser])

  if (isLoading) {
    return <div>로딩중...</div>
  }

  // 만약 앨범이 없을 경우
  if (!album.length) return <div>앨범이 없습니다.</div>;

  // 랜덤으로 앨범 하나 선택하기
  const  ramdomAlbum = album[Math.floor(Math.random() * album.length)]

  // 날짜 이쁘게 변경
  const formattedDate = new Date(ramdomAlbum.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  } 
  )

  return (
    <>

      {/* 텍스트 section */}
      <div>
        <p style={{marginLeft:10, fontSize:12, fontWeight:300, color:"#66656C"}}>{formattedDate}로 떠나볼까요?</p>
      </div>

      {/* 앨범 정보 section */}
      <div className = "RandomSection" onClick={() =>{nav(`/albums/${ramdomAlbum.albumId}`)}}>
        {/* 사진 렌더링 */}
        <div className="RandomSectionImage">
          <img className="MainImage"src={ramdomAlbum.albumImageUrl} alt="" />
          <img className="SubImage" src={ramdomAlbum.albumImageUrl} alt="" />
          <img className="SubImage2"src="/assets/탑.png" alt="" />
        </div>

        {/* 플레이리스트 렌더링 */}
        <div className="RandomAlbumPlaylist">

        {ramdomAlbum.playlists.map((playlist, index) => (
          <div key={playlist.playlistId} style={{display:"flex", justifyContent:"start"}}>
            {/* 1부터 시작해서 두 자리 문자열로 변환하기 */}
            <p style={{color:"white", margin:5}}> 
              <span style={{fontWeight:900, fontSize:16}}>{String(index+1).padStart(2, "0")}&nbsp;</span> 
              <span style={{
                fontSize:12,
                fontWeight:400
              }}>
                {playlist.locationAddress}&nbsp;|&nbsp;
                {playlist.musicDetails.trackName}&nbsp;-&nbsp; 
                {playlist.musicDetails.artistName}
              </span>
            </p>
          </div>
        ))}
        </div>
      </div>

    </>
  )
}

  export default RamdomSection