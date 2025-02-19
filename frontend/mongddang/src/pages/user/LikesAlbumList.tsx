import React, { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import './LikeAlbumList.css'
interface Music {
  musicId : number // 해당 앨범의 노래 아이디
  trackName : string;
  artistName: string;
  albumCover: string;
}

interface Photos {
  PhotoId: number //
  photoURL: string;
}

interface Playlists {
  music: Music;
  photos: Photos[];
}

interface Album {
  albumId: number // 해당 앨범의 아이디
  title: string;
  albumImageURL: string;
  authorNickname:string
  playlists: Playlists[]
}

interface LikesAlbumResponse {
  likeAlbums: Album[]
  id: string
}

interface UserProps {
  loggedInuser: String
  thirdSectionRef?: React.RefObject<HTMLDivElement>
}

function LikesAlbumList ({loggedInuser, thirdSectionRef}:UserProps) {

  const nav = useNavigate()
  const [lists, setLists] = useState<LikesAlbumResponse>({likeAlbums: [], id: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!loggedInuser) return //사람값 구하는데 시간 걸리니까 

      setIsLoading(true)

      try {
        const res = await axiosInstance.get('/like/albums')
        setLists(res.data)
        console.log("좋아요 목록 불러오기 성공:", res.data)
      }catch (err) {
        console.log("좋아요 목록 불러오기 실패: ", err)
      }finally {
        setIsLoading(false)
      }
    }
    fetchAlbums()
  }, [loggedInuser])

  if (isLoading) {
    return (
      <div>로딩중...</div>
    )
  }


  // 만약 좋아요한 앨범이 없을 떄
  if (!lists.likeAlbums) {
    return <div>좋아요한 앨범이 없습니다.</div>
  }

  const firstSection = lists.likeAlbums.slice(0,3)
  const secondSection = lists.likeAlbums[0]
  const thirdSection = lists.likeAlbums.slice(3)

  // 클릭하면 해당 앨범 상세페이지로 이동하기
  const goToAlbumDetail = (albumId: String) => {
    console.log("앨범 상세페이지로 이동", albumId)
    nav(`/albums/${albumId}`, {replace: true})
  }
  
  return (
    <div style={{marginTop:10}}>

      {/* 3개만 렌더링하기 */}
        <div className = "LikeAlbums">
          {firstSection.map((album) => (
            <div className="LikeAlbum"key={album.albumId}> 


              <img style={{borderRadius:"5px", width:"117px", height:"auto"}}src={album.albumImageURL} onClick={() => goToAlbumDetail(String(album.albumId))}/>

            </div>
          ))}
        </div>
      
      {/* 첫 번째 앨범 렌더링 일단 사진만 누르면 해당 상세페이지로 이동하게함*/}
        <div style={{marginTop:"20px"}}>
          <div className="LikeAlbumImages">
            <img className="AlbumImage"src={secondSection.albumImageURL} onClick={() => goToAlbumDetail(String(secondSection.albumId))}/>
            
            <img className="PlayButton"src="../../public/assets/탑.png" alt="" onClick={() => goToAlbumDetail(String(secondSection.albumId))}/>
          </div>
          <div className="AlbumAuthor">
            <p className="AuthorNickname">{secondSection.authorNickname}</p>
            <p className="AlbumTitle">{secondSection.title}</p>
          </div>
         {/*노래 리스트 출력*/}
          <div>
            {secondSection.playlists.map((playlist) => {
              const randomIndex = Math.floor(Math.random() * (playlist.photos?.length || 1)); // 랜덤 인덱스 계산
              return (
                <div className="Playlist" key={playlist.music.musicId} style={{display: "flex"}}>
                  {/* 랜덤 이미지 선택 */}
                  <img src={playlist.photos?.[randomIndex]?.photoURL}/>
                  <div className="MusicInfo">
                    <p className="TrackName">{playlist.music.trackName}</p>
                    <p className="ArtistName">{playlist.music.artistName}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 네번째 앨범부터 다시 렌더링 */}
          <div className = "LikeAlbums" ref={thirdSectionRef} style={{marginBottom:"50px"}} >
            {thirdSection.map((album) => (
              <div className="LikeAlbum" key={album.albumId} > 
                <img style={{marginTop:"40px"}} src={album.albumImageURL} width={100} onClick={() => goToAlbumDetail(String(album.albumId))} />

              </div>
            ))}
          </div>

        
    </div>
  )
}

export default LikesAlbumList