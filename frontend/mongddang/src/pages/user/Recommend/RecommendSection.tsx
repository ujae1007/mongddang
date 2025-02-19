import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './RecommendSection.css'

interface MusicDetail {
  musicId : number // 해당 앨범의 노래 아이디
  trackName : string;
  artistName: string;
  genre: string;
  popularity: number;
}

interface Playlists {
  playlistId: number
  albumId: number
  musicId: number
  startTime: number
  endTime: number
  locationAddress: string
  photoUrls: string[]
  musicDetails: MusicDetail
}

interface Album {
  albumId: number // 해당 앨범의 아이디
  nickname: string
  userId: number
  title: string;
  albumImageUrl: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  playlists: Playlists[]
}

type RecommendAlbumResponse = Album[]

const RecommendSection = () => {

  const nav = useNavigate()
  const [lists, setLists] = useState<RecommendAlbumResponse>([])
  const [isloading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axiosInstance.get('/albums/recommendation')
        setLists(res.data)
        console.log("추천 앨범 불러오기 성공: ", res.data)
      }catch (err) {
        console.log("추천 앨범 불러오기 실패: ", err)
      }finally {
        setIsLoading(false)
      }
    }
    fetchAlbums()
  },[nav])

  if (isloading) {
    return (
      <div>로딩중...</div>
    )
  }


  const goToDetail = (albumId:String) => {
    console.log("앨범 상세로 이동: ",albumId )
    nav(`/album/${albumId}`)
  }
  return (
    <div className="RecoWrap">

      {/* 텍스트 section */}
        <h1 style={{marginLeft:"10px", marginBottom:"5px", fontSize:"30px", fontWeight:"600"}}>FOR YOU</h1>
        <p style={{marginLeft:"10px", marginTop:"0px",marginBottom:"0px",color:"#66656C"}}>좋아하실만한 앨범들을 추천해드릴게요!</p>
      
      {/* 앨범 section */}
      <div className="RecommendAlbums" style={{padding:"10px"}}>
        {/* 앨범 상단 */}
        {lists.map((album) => (
          <div className="RecommendAlbum" key={album.albumId} onClick={() => goToDetail(String(album.albumId))}>
            <div style={{display:"flex", justifyContent:"center", paddingTop:"10px", paddingBottom:"20px"}}>
            {/* <img src={album.albumImageUrl} alt="" width={200}/> */}
              <img className="RecommendAlbumImage" src="/assets/album_sample.png" alt="" />
            </div>
            <img style={{paddingLeft:"23px"}} src="/assets/구분선.svg" alt="" />
            <div className="RecommendAlbumInfo">
              <p style={{margin:"0px", fontSize:"24px"}}>{album.title}</p>
              <p style={{margin:"0px", fontSize:"16px"}}>{album.nickname}</p>
            </div>
        
            {/* 앨범 하단 */}
            {album.playlists.map((playlist) =>(
              <div className="RecommendAlbumPlayList"key={playlist.playlistId}>
                {/* <img src={playlist.photoUrls[0]} alt="" /> */}
                <div style={{padding:"18px", display:"flex"}}>
                  <img style={{width:"80px",height:"80px", borderRadius:"5px"}}src="/assets/minjeong_profile.png" alt="" />
                  <div style={{ paddingLeft:"10px"}}>
                    <p style={{margin:"0", marginLeft:"0px", marginTop:"15px",marginBottom:"10px",fontSize:"18px", color:"#252525"}}>{playlist.musicDetails.artistName}</p>
                    <p style={{margin:"0", marginLeft:"0px", color:"#66656C"}}>{playlist.musicDetails.trackName}</p>
                  </div>
                </div>
              </div>
        ))}
          </div>
        ))}
      </div>


    </div>
  )
}

export default RecommendSection