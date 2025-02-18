import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import './Random.css'

interface Album {
  albumId: number;
  userId: number;
  title: string;
  albumImageUrl: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  playlists: Playlist[];
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
  musicDetails: MusicDetails[];
}

interface MusicDetails {
  musicId: number;
  trackName: string;
  artistName: string;
  genre: string;
  popularity: number;
}

interface UserProps {
  loggedInUser: string;
}

function RamdomSection({loggedInUser}: UserProps) {

  const nav = useNavigate()

  const User = useAuth()
  const nickname = User?.nickname
  
  //현재 재생될 앨범
  const [album, setAlbum] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 앨범 목록 가져오기
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!loggedInUser) return
      setIsLoading(true)
      
      try {
        const res = await axiosInstance.get('/albums/my')
        setAlbum(res.data)
        setIsLoading(false)
        console.log("랜덤 앨범 목록 불러오기 성공:", res.data)
      } catch (err) {
        console.log("랜덤 앨범 목록 불러오기 실패:", err)
      } finally {
        setIsLoading(false)
      }


    }
    fetchAlbums()
  },[loggedInUser])

  // if (isLoading) {
  //   return <div>로딩중...</div>
  // }

  // 만약 앨범이 없을 경우
  // if (!album.length) return <div>앨범이 없습니다.</div>;

  // 랜덤으로 앨범 하나 선택하기
  // const  ramdomAlbum = album[Math.floor(Math.random() * album.length)]
    const ramdomAlbum = album.length > 0 ? album[Math.floor(Math.random() * album.length)] : null;

  // 날짜 이쁘게 변경
  // const formattedDate = new Date(ramdomAlbum.createdAt).toLocaleDateString('ko-KR', {
  const formattedDate = ramdomAlbum ? new Date(ramdomAlbum.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
 : "";

  return (
    <>
      {isLoading ? (
        <div>로딩중...</div>
      ) : !album.length ? (
        <div style={{display: "flex", flexDirection: "column", position:"relative", alignItems: "center"}}>
          <p style={{position:"absolute",top:"180px", fontSize:"22px", color:"#9747FF", fontWeight:"600"}}>앨범이 없습니다.</p>
          <p style={{position:"absolute",top:"220px", fontSize:"25px", fontWeight:"700"}}>나만의 앨범을 생성해보세요!</p>
          <motion.img 
            style={{
              position: "absolute",
              top: "340px",
              rotate:"230deg", // 가운데 정렬 + 회전
              width: "200px",
            }}
            src="/assets/손.png" 
            alt=""
            animate={{ y: [-10, 10, -10] }} // 위아래로 움직이기
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} // 부드럽게 반복
          />
          <motion.img 
            style={{width:"140px",position: "fixed",bottom: "-25px", zIndex:"9999"}}
            src="/assets/noalbum.png" 
            alt="" 
            animate={{ scale: [1, 1.1, 1] }} // 1배 → 1.2배 → 1배 반복
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      ) : (
        <>
          {/* 텍스트 section */}
          <h2 style={{marginLeft:"20px",marginBottom:0, color:"#252525"}}>반갑습니다. {nickname}님!</h2>
          <div>
            <p style={{marginLeft:"20px", marginTop:3, fontSize:18, fontWeight:400, color:"#66656C"}}>
              {formattedDate}로 떠나볼까요?
            </p>
          </div>

          {/* 앨범 정보 section */}
          <div className="RandomSection" onClick={() => nav(`/albums/${ramdomAlbum?.albumId}`)}>
            {/* 사진 렌더링 */}
            <div className="RandomSectionImage">
              <img className="MainImage" src={ramdomAlbum?.albumImageUrl} alt="" />
              <img 
                className="SubImage" src={ramdomAlbum?.albumImageUrl} alt=""   
              />
              <img className="SubImage2" src="/assets/whitetri.png" alt="" />
            </div>

            {/* 플레이리스트 렌더링 */}
            <div className="RandomAlbumPlaylist">
              {ramdomAlbum?.playlists.slice(0,3).map((playlist, index) => (
                <div key={playlist.playlistId} style={{display:"flex", justifyContent:"start"}}>
                  <p style={{color:"white", margin:5}}> 
                    <span style={{fontWeight:900, fontSize:16}}>
                      {String(index+1).padStart(2, "0")}&nbsp;
                    </span> 
                    <span style={{fontSize:16, fontWeight:400}}>
                      {playlist.locationAddress}&nbsp;|&nbsp;
                      {playlist.musicDetails.trackName} 
                      {/* {playlist.musicDetails.artistName} */}
                    </span>
                  </p>
                </div>
              ))}
            </div>


          </div>

        </>
      )}
    </>
  );
}

  export default RamdomSection