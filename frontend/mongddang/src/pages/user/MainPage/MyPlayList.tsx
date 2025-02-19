import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import './MyPlayList.css'

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
  musicDetails: MusicDetails;
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

function MyPlayListSection({loggedInUser}: UserProps) {

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
  // if (!album.length) return <div>앨범이 없습니다.</div>;

  // 최대 5개까지만 보여주기
  const displayAlbum = album.slice(0, 5)

  return (

    // 각각의 앨범 조회
    <div style={{marginBottom:"30px"}}>
    {!album.length? "" : <h2 style={{marginLeft:"20px", margin:"10px"}}>나의 앨범</h2>}
    <div className="MyAlbums">
      {displayAlbum.map((currentAlbum) => (
        <div className="MyPlayList" key={currentAlbum.albumId} onClick={() =>{nav(`/albums/${currentAlbum.albumId}`)}}>
          <div className="MyPlayListInfo">

              <div className="ImageTitle">
                {/* 앨범 정보 렌더링 */}
                <img src={currentAlbum.albumImageUrl} alt=""  width="100" style={{borderRadius:"10px"}}/>
                <h3>{currentAlbum.title}</h3>
              </div>
            <p style={{margin:"15px 0", fontWeight:"semibold"}}>지금 당신의 플레이리스트를 감상하세요.</p>

            {/* 해당 앨범의 플레이리스트 렌더링 */}
            <div className="Playlists" >
              {/* 플레이리스트 3개 이상이더라도 3개까지만 출력*/}
              {currentAlbum.playlists.slice(0,3).map((currentPlaylist) => (
                
                  <div className = "MyPlaylist" key={currentPlaylist.playlistId} style={{margin:"10px 0px"}}>
                    <img className="MyAlbumPlaylistImage" src={currentPlaylist.photoUrls[0]} alt=""/>
                    <div className="text" >
                      <p className="LocationAddress">{currentPlaylist.locationAddress}</p>
                      <p className="MucisInfo">{currentPlaylist.musicDetails.artistName}&nbsp;&nbsp; - &nbsp;&nbsp;{currentPlaylist.musicDetails.trackName}</p>
                    </div>
                  </div>
              ))}  
              {currentAlbum.playlists.length > 3 && (<div style={{color:"#E6E6E8", textAlign:"right"}}>+ 더보기</div>)}
            </div>
            </div>    
          </div>
          
      ))}


    </div>
    </div>
  )
}

  export default MyPlayListSection