import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import './PopularSection.css'
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
    <div className="LikeTopTenWarp">

      {/* 텍스트 section */}

      <h1 style={{marginLeft:"10px", marginBottom:"5px", fontSize:"30px", fontWeight:"600"}}>Likes TOP 10</h1> 
      <p style={{marginLeft:"10px", marginTop:"0px",marginBottom:"0px",color:"#66656C"}}>지금 가장 인기 있는 앨범을 알아보세요!</p>

      {/* 앨범 section */}
      <div className="LikeTopTenAlbums" style={{padding:"10px"}}>
        {topTenLists.likeTopTenLists.map((album) => (

          <div className="LikeTopTenAlbum" key={album.albumId} onClick={() => {goToAlbumDetail(String(album.albumId))}}>

            <div className="LikeTopTenAlbumImage"
              style={{backgroundImage: `url(${album.albumImageURL})`, marginLeft:"10px"
              }}
            >
            </div>
            <div className="LikeTopTenAlbumInfo">
              <p style={{fontSize:"24px", margin:0, textAlign:"center"}}>{album.title}</p>
              <p style={{fontSize:"16px", margin:0}}>{album.authorNickname}</p>
            </div>
            
            <div style={{display:"flex", flexDirection:"column"}}>
              {album.playlists.map((playlist, index) => (
                <div className="LikeTopTenAlbumPlayListInfo" key={playlist.playlistId}>
                  <p style={{fontSize:"18px",marginBottom:"10px", color:"#000",fontWeight:600}}>{String(index + 1).padStart(2, "0")}. &nbsp; 
                    <span style={{fontSize:"14px", fontWeight:500}}>{playlist.locationAddress}</span></p>
                </div>
              ))}
            </div>

          </div>
          
        ))}
      </div>
      
      
      
    
    </div>
  )
}

export default PopularSection