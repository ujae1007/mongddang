// 컴포넌트로 사용할 때 몇 번째 플레이 리스트인지만 받아오면 됨
// 혜민이한테 받아오는 값
//<YoutubePlayer playlistIndex={0} />

import MusicPlayer from "../../components/youtube/youtubeRequest";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";

interface MusicDetails {
  musicId: number;
  trackName: string;
  artistName: string;
  genre: string;
  popularity: number;
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

interface AlbumResponse {
  albumId: number;
  userId: number;
  title: string;
  albumImageUrl: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  playlists: Playlist[];
}

// 혜민이한테 받아오는 값
interface YoutubePracticeProps {  
  playlistIndex: number;
}

const YoutubePlayer = ({ playlistIndex}: YoutubePracticeProps) => {

  // params 앨범Id 가져오기
  const {albumId} = useParams<{albumId:string}>()

  // 앨범 데이터 상태
  const [albumData, setAlbumData] = useState<AlbumResponse | null>(null)
  
  // 첫 렌더링 될 때, 앨범 아이디가 변경될 때 데이터 받아오기
  useEffect (() => {

    const fetchMusicData = async() => {
      console.log("유튜브 검색 시작")
      try {
        const res = await axiosInstance.get<AlbumResponse>(`/albums/detail/${albumId}`) 
        // console.log("유튜브 영상 데이터", res.data)
        console.log("유튜브 영상 데이터", res.data.playlists[playlistIndex])
        setAlbumData(res.data)
      } catch(err) {
        console.log("유튜브 검색 실패", err)
      }
    }
    if (albumId){
      fetchMusicData()
    }

  }, [albumId])

  // 현재 재생 중인 플레이리스트가 없거나 앨범 데이터가 없는 경우
  if (!albumData?.playlists[playlistIndex]) {
    return <div>재생할 음악이 없습니다.</div>
  }

  const { trackName, artistName } = albumData.playlists[playlistIndex].musicDetails;

  return (
    <div>
      <MusicPlayer 
        trackName={trackName} 
        artistName={artistName}
      />
    </div>
  )
}

export default YoutubePlayer