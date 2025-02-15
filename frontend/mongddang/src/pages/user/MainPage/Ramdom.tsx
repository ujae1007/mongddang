import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

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

  // 임시 데이터
  const mockAlbum : Album[] = 
  [
    {
      "albumId": 100,
      "userId": 10,
      "title": "드라이브할 때 듣기 좋은 노래",
      "albumImageUrl": "/assets/album_sample.png",
      "status": true,
      "createdAt": "2025-02-10T08:00:00",
      "updatedAt": "2025-02-12T10:30:00",
      "playlists": [
        {
          "playlistId": 201,
          "albumId": 100,
          "musicId": 10,
          "startTime": 30,
          "endTime": 180,
          "latitude": 37.7749,
          "longitude": -122.4194,
          "locationAddress": "San Francisco, USA",
          "photoUrls": [
            "/assets/album_sample.png"
          ],
          "musicDetails": [{
            "musicId": 10,
            "trackName": "Blinding Lights",
            "artistName": "The Weeknd",
            "genre": "Pop",
            "popularity": 95
          }]
        },
        {
          "playlistId": 202,
          "albumId": 100,
          "musicId": 11,
          "startTime": 40,
          "endTime": 200,
          "latitude": 34.0522,
          "longitude": -118.2437,
          "locationAddress": "Los Angeles, USA",
          "photoUrls": [
            "/assets/album_sample.png"
          ],
          "musicDetails": [{
            "musicId": 11,
            "trackName": "Levitating",
            "artistName": "Dua Lipa",
            "genre": "Pop",
            "popularity": 85
          }]
        },
        {
          "playlistId": 203,
          "albumId": 100,
          "musicId": 12,
          "startTime": 20,
          "endTime": 190,
          "latitude": 40.7128,
          "longitude": -74.0060,
          "locationAddress": "New York, USA",
          "photoUrls": [
            "/assets/album_sample.png"
          ],
          "musicDetails": [{
            "musicId": 12,
            "trackName": "Shape of You",
            "artistName": "Ed Sheeran",
            "genre": "Pop",
            "popularity": 92
          }]
        }
      ]
    },
    {
      "albumId": 101,
      "userId": 11,
      "title": "비오는 날 듣는 감성 음악",
      "albumImageUrl": "/assets/albumCover.jpg",
      "status": true,
      "createdAt": "2025-02-11T09:30:00",
      "updatedAt": "2025-02-13T15:45:00",
      "playlists": [
        {
          "playlistId": 204,
          "albumId": 101,
          "musicId": 13,
          "startTime": 50,
          "endTime": 200,
          "latitude": 48.8566,
          "longitude": 2.3522,
          "locationAddress": "Paris, France",
          "photoUrls": [
            "/assets/albumCover.jpg"
          ],
          "musicDetails": [{
            "musicId": 13,
            "trackName": "밤편지",
            "artistName": "아이유",
            "genre": "발라드",
            "popularity": 90
          }]
        },
        {
          "playlistId": 205,
          "albumId": 101,
          "musicId": 14,
          "startTime": 60,
          "endTime": 210,
          "latitude": 51.5074,
          "longitude": -0.1278,
          "locationAddress": "London, UK",
          "photoUrls": [
            "/assets/albumCover.jpg"
          ],
          "musicDetails": [{
            "musicId": 14,
            "trackName": "Rain",
            "artistName": "태연",
            "genre": "발라드",
            "popularity": 80
          }]
        },
        {
          "playlistId": 206,
          "albumId": 101,
          "musicId": 15,
          "startTime": 40,
          "endTime": 180,
          "latitude": 35.6895,
          "longitude": 139.6917,
          "locationAddress": "Tokyo, Japan",
          "photoUrls": [
            "/assets/albumCover.jpg"
          ],
          "musicDetails": [{
            "musicId": 15,
            "trackName": "Someone Like You",
            "artistName": "Adele",
            "genre": "Pop",
            "popularity": 88
          }]
        },
        {
          "playlistId": 207,
          "albumId": 101,
          "musicId": 16,
          "startTime": 30,
          "endTime": 170,
          "latitude": 37.5665,
          "longitude": 126.9780,
          "locationAddress": "Seoul, Korea",
          "photoUrls": [
            "/assets/albumCover.jpg"
          ],
          "musicDetails": [{
            "musicId": 16,
            "trackName": "Stay With Me",
            "artistName": "Sam Smith",
            "genre": "Pop",
            "popularity": 87
          }]
        }
      ]
    },
    {
      "albumId": 102,
      "userId": 12,
      "title": "힙합 명곡 모음",
      "albumImageUrl": "/assets/albumCover2.jpg",
      "status": false,
      "createdAt": "2025-02-12T12:00:00",
      "updatedAt": "2025-02-14T18:10:00",
      "playlists": [
        {
          "playlistId": 208,
          "albumId": 102,
          "musicId": 17,
          "startTime": 45,
          "endTime": 200,
          "latitude": 34.0522,
          "longitude": -118.2437,
          "locationAddress": "Los Angeles, USA",
          "photoUrls": [
            "/assets/albumCover2.jpg"
          ],
          "musicDetails": [{
            "musicId": 17,
            "trackName": "Sicko Mode",
            "artistName": "Travis Scott",
            "genre": "Hip-Hop",
            "popularity": 92
          }]
        },
        {
          "playlistId": 209,
          "albumId": 102,
          "musicId": 18,
          "startTime": 20,
          "endTime": 180,
          "latitude": 40.7128,
          "longitude": -74.0060,
          "locationAddress": "New York, USA",
          "photoUrls": [
            "/assets/albumCover2.jpg"
          ],
          "musicDetails": [{
            "musicId": 18,
            "trackName": "God's Plan",
            "artistName": "Drake",
            "genre": "Hip-Hop",
            "popularity": 95
          }]
        },
        {
          "playlistId": 210,
          "albumId": 102,
          "musicId": 19,
          "startTime": 60,
          "endTime": 220,
          "latitude": 41.8781,
          "longitude": -87.6298,
          "locationAddress": "Chicago, USA",
          "photoUrls": [
            "/assets/albumCover2.jpg"
          ],
          "musicDetails": [{
            "musicId": 19,
            "trackName": "Lose Yourself",
            "artistName": "Eminem",
            "genre": "Hip-Hop",
            "popularity": 98
          }]
        }
      ]
    }
  ]
  
  
  //현재 재생될 앨범
  const [album, setAlbum] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 앨범 목록 가져오기
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!loggedInUser) return
      setIsLoading(true)

      //일단 임시데이터로 확인
      setAlbum(mockAlbum)
      setIsLoading(false)

    //   try {
    //     const res = await axiosInstance.get('/albums/my')
    //     setAlbum(res.data)
    //     setIsLoading(false)
    //     console.log("랜덤 앨범 목록 불러오기 성공:", res.data)
    //   } catch (err) {
    //     console.log("랜덤 앨범 목록 불러오기 실패:", err)
    //   } finally {
    //     setIsLoading(false)
    // }


    }
    fetchAlbums()
  },[loggedInUser])

  if (isLoading) {
    return <div>로딩중...</div>
  }

  // 만약 앨범이 없을 경우
  if (!album.length) return <div>앨범이 없습니다.</div>;

  // 랜덤으로 앨범 하나 선택하기
  const  ramdomAlbum = album[Math.floor(Math.random() * album.length)]

  // 날짜 이쁘게 변경
  const formattedDate = new Date(ramdomAlbum.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  } 
  )

  return (
    <div>

      {/* 텍스트 section */}
      <div>
        <p>{formattedDate}로 떠나볼까요?</p>
      </div>

      {/* 앨범 정보 section */}
      <div onClick={() =>{nav(`/albums/detail/${ramdomAlbum.albumId}`)}}>
        {/* 사진 렌더링 */}
        <div>
          <img src={ramdomAlbum.albumImageUrl} alt=""  width="100"/>
          <img src={ramdomAlbum.albumImageUrl} alt="" width="100" style={{borderRadius:"50%"}}/>
          <img src="/assets/탑.png" alt="" />
        </div>

        {/* 플레이리스트 렌더링 */}
        {ramdomAlbum.playlists.map((playlist, index) => (
          <div key={playlist.playlistId} style={{display: "flex"}}>
            {/* 1부터 시작해서 두 자리 문자열로 변환하기 */}
            <p>{String(index+1).padStart(2, "0")}&nbsp;</p>
            <p>{playlist.locationAddress}&nbsp;|&nbsp;</p>
            <p>{playlist.musicDetails[0].trackName}&nbsp;-&nbsp; </p>
            <p>{playlist.musicDetails[0].artistName}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

  export default RamdomSection