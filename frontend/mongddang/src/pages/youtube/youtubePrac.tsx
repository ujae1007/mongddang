import MusicPlayer from "../../components/youtube/youtubeRequest";

// 백에서 데이터 받아와서 테스트 해보기 

const YoutubePractice = () => {
  return (
    <div>
  <MusicPlayer 
    track_name="what is love" 
    artist_name="트와이스" 
  />
    </div>
  )
}

export default YoutubePractice