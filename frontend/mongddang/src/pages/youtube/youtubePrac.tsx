import MusicPlayer from "../../components/youtube/youtubeRequest";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";


// 백에서 데이터 받아와서 테스트 해보기 

const YoutubePractice = () => {

  // params 앨범Id 가져오기
  const {albumId} = useParams<{albumId:string}>()

  // 앨범Id값을 통해  playlistId

  // 앨범 정보 
  const [trackName, setTrackName] = useState<string>("")
  const [artistName, setArtistName] = useState<string>("")
  
  // 첫 렌더링 될 때, 앨범 아이디가 변경될 때 데이터 받아오기

  useEffect (() => {
    const fetchMusicData = async() => {
      console.log("유튜브 검색 시작")

      try {
        const res = await axiosInstance.get(`/albums/detail/${albumId}`)
        console.log("유튜브 영상 데이터", res.data)
      } catch(err) {
        console.log("유튜브 검색 실패", err)
      }
    }
    fetchMusicData()
  }, [albumId])

  return (
    <div>
  <MusicPlayer 
    // trackName={trackName} 
    // artistName={artistName}
    trackName="신호등" 
    artistName="이무진"
  />
    </div>
  )
}

export default YoutubePractice