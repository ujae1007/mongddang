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
      <div className="RecoTitleWrap">
        <div className="RecoTitle" >For you</div>
        <div className="RocoSubTitle">좋아하실만한 앨범들을 추천해드릴게요!</div>
      </div>
      
      {/* 앨범 section */}
      <div >


        {/* 앨범 상단 */}
        {lists.map((album) => (
          <div key={album.albumId} onClick={() => goToDetail(String(album.albumId))}>
            <img src={album.albumImageUrl} alt="" width={200}/>
            <p>{album.nickname}</p>
            <p>{album.title}</p>
        
            {/* 앨범 하단 */}
            {album.playlists.map((playlist) =>(
              <div key={playlist.playlistId}>
                {/* <img src={playlist.photoUrls[0]} alt="" /> */}
                <img src="/assets/minjeong_profile.png" alt="" />
                <p>{playlist.locationAddress}</p>
                <p>{playlist.musicDetails.artistName}&nbsp;-&nbsp;{playlist.musicDetails.trackName}</p>
          </div>
        ))}


          </div>
        ))}
      </div>


    </div>
  )
}

export default RecommendSection