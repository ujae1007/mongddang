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
  track_name: string;
  artist_name: string;
}

//API 검색하기 
const searchVideos = async (track_name: string, artist_name:string,): Promise<Youtube[]> => {
  try{
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        key: API_KEY,
        q:`${artist_name} ${track_name}`,
        part: "snippet",
        maxResults: 1,
        type: "video"
      }
    })
    console.log(res.data)
    return res.data.items
  }catch(err){
    console.log("youtube 오류", err)
    return []
  }
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({track_name, artist_name}) => {
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() =>{
    const fetchVideo = async () => {
      const videos = await searchVideos(track_name, artist_name)
      if (videos.length > 0) {
        setVideoId(videos[0].id.videoId)
      }
    }
    if (track_name && artist_name) {
      fetchVideo()
    }
  }, [track_name, artist_name])

  if (!videoId) 
    return null

  return (
    <div>
    <iframe
      width="150"
      height="150"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
  )
}


export default MusicPlayer;