//youtube API와 통신하는 파일 
import axios from "axios";
import React,{useEffect, useState} from "react";

const API_KEY = import.meta.env.VITE_YOUTUBE_KEY
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// 유튜브 api응답 타입 지정 
interface Youtube {
  id: {videoId: string}
  snippet: {
    title: string
    description: string
    thumbnails: {medium: {url:string}}
  }
}

// 플레이어  타입 지정 
interface MusicPlayerProps {
  trackName: string;
  artistName: string;
}

//API 검색하기 
const searchVideos = async (trackName: string, artistName:string,): Promise<Youtube[]> => {
  try{
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        key: API_KEY,
        q:`${artistName} ${trackName}`,
        part: "snippet",
        maxResults: 1,
        type: "video"
      }
    })
    console.log("유투브 정보", res.data)
    return res.data.items
  }catch(err){
    console.log("youtube 오류", err)
    return []
  }
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({trackName, artistName}) => {
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() =>{
    const fetchVideo = async () => {
      const videos = await searchVideos(trackName, artistName)
      if (videos.length > 0) {
        setVideoId(videos[0].id.videoId)
      }
    }
    if (trackName && artistName) {
      fetchVideo()
    }
  }, [trackName, artistName])

  if (!videoId) 
    return null

  return (
    <div>
    <iframe
      width="200"
      height="200"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
  )
}


export default MusicPlayer;