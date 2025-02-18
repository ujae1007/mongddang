import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

interface Music {
  musicId : number // 해당 앨범의 노래 아이디
  trackName : string;
  artistName: string;
}

interface Playlist {
  playlistId: number
  locationAddress: string
  music: Music;
}

interface Album {
  albumId: number // 해당 앨범의 아이디
  title: string;
  albumImageURL: string;
  authorNickname:string
  authorProfileURL: string
  playlists: Playlist[]
}

interface MostLikesAlbumResponse {
  likeTopTenLists: Album[]
  id: number
}


const PopularSection = () => {

  const nav = useNavigate()

  const [topTenLists, setTopTenLists] = useState<MostLikesAlbumResponse>({likeTopTenLists:[], id:1})
  const [isLoading, setIsLoading] = useState(true)

  //API 호출하기
  useEffect(() => {
    const fetchAlbums = async () => {

      try {
        const res = await axiosInstance.get('/like/top-10/albums')
        setTopTenLists(res.data)
        console.log("TopTen 목록 불러오기 성공: ", res.data)
      }catch (err) {
        console.log("ToTen 목록 불러오기 실패: ", err)
      }finally{
        setIsLoading(false)
      }
    }
    fetchAlbums()
  },[nav])

  if(isLoading){
    return(
      <div>로딩중...</div>
    )
  }
  
  // 해당 상세 페이지로 이동
  const goToAlbumDetail = (albumId:string) => {
    console.log("앨범 상세 페이지로 이동: ", albumId)
    nav(`/albums/${albumId}`)
    return 
  }

  return (
    <div>

      {/* 텍스트 section */}
      <div>
        <h1>Likes TOP 10</h1> 
        <h2>지금 가장 인기 있는 앨범을 알아보세요!</h2>
      </div>

      {/* 앨범 section */}
      <div>
        {topTenLists.likeTopTenLists.map((album) => (

          <div key={album.albumId} onClick={() => {goToAlbumDetail(String(album.albumId))}}>

            <img src={album.albumImageURL} alt="" width={100}/>
            <img src={album.authorProfileURL} alt="" />
            <p>{album.authorNickname}</p>

            {album.playlists.map((playlist, index) => (
              <div key={playlist.playlistId}>
                <p>Track {String(index + 1).padStart(2, "0")}</p>
                <p>{playlist.locationAddress}</p>
              </div>
            ))}

          </div>
          
        ))}
      </div>
      
      
      
    
    </div>
  )
}

export default PopularSection