import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  nickName: string
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
        const res = await axiosInstance.get('albums/recommends')
        setLists(res.data)
        console.log("추천 앨범 불러오기 성공: ", res.data)
      }catch (err) {
        console.log("추천 앨범 불러오기 실패: ", err)
      }finally {
        setIsLoading(false)
      }
    }
    fetchAlbums()
  })

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
    <div>

      {/* 텍스트 section */}
      <div>
        <h1>For you</h1>
        <h2>좋아하실만한 앨범들을 추천해드릴게요!</h2>
      </div>
      
      {/* 앨범 section */}
      <div >


        {/* 앨범 상단 */}
        {lists.map((album) => (
          <div key={album.albumId} onClick={() => goToDetail(String(album.albumId))}>
            <img src={album.albumImageUrl} alt="" />
            <p>{album.nickName}</p>
            <p>{album.title}</p>
        
            {/* 앨범 하단 */}
            {album.playlists.map((playlist) =>(
              <div key={playlist.playlistId}>
                <img src={playlist.photoUrls[0]} alt="" />
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