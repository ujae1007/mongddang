import { useState, useEffect } from 'react';
import MapBox from "../../../components/album/MapBox"
import axiosInstance from "../../../api/axiosInstance"
import { fi } from 'date-fns/locale';
import './Map.css'
// 앨범 정보
interface AlbumDetail {
  userId: number;
  title: string;
  playlists: Array<{
    playlistId: number;
    albumId: number;
    musicId: number;
    startTime: number | null;
    endTime: number | null;
    latitude: string;
    longitude: string;
    locationAddress: string;
    photoUrls: string[];
    musicDetails: {
      title: string;
      artist: string;
    };
  }>;
  albumImageUrl: string;
}

function Map () {

  const [latestAlbum, setlatestAlbum] = useState<AlbumDetail | null>(null); // 가장 최근 앨범
  const [selectedPlaylist, setSelectedPlaylist] = useState<AlbumDetail['playlists'][0] | null>(null); // 선택한 플레이리스트 - 초기에는 첫 번째 플레이리스트로 설정
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 가장 최근 앨범 정보 가져오기
  useEffect(() => {
    const fetchLatestAlbum = async () => {
      setIsLoading(true);
  
      try {
        // 내 전체 앨범 가져오기
        const response = await axiosInstance.get('/albums/my');
        const myAlbums = response.data;

        // 가장 최근 앨범 가져오기
        const latestAlbum = myAlbums[myAlbums.length - 1];

        if (latestAlbum) {

          const albumDetailResponse = await axiosInstance.get(`/albums/detail/${latestAlbum.albumId}`);
          setlatestAlbum(albumDetailResponse.data);
          if (albumDetailResponse.data.playlists.length > 0) {
            // 첫 번째 플레이리스트로 초기 선택된 플레이리스트 설정
            setSelectedPlaylist(albumDetailResponse.data.playlists[0]);
          }
        }
      } catch (error) {
        console.error('가장 최근 앨범 정보 가져오기 실패', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLatestAlbum();
  }, []);

  // 플레이리스트 선택
  const handlePlaylistSelect = (playlistId:number) => {
    if (latestAlbum) {
      const selected =latestAlbum.playlists.find(
        playlist => playlist.playlistId === playlistId
      );
      setSelectedPlaylist(selected || null);
    }
  }

  // MapBox에 전달할 데이터 형식 변환
  const mapBoxPlaylists = latestAlbum?.playlists?.map(playlist => ({
    ...playlist,
    placeName: playlist.locationAddress,  // MapBox가 기대하는 필드명으로 변환
  })) || [];

  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  
  return (
    <>
      {latestAlbum && (
        <>
          {/* 지도 */}
          <div className="MainPage-MapSection"style={{margin:"10px"}}>
            {mapBoxPlaylists.length > 0 && (
            <>
              <h3 style={{marginTop:"0px"}}> 최근 여행지로 떠나볼까요?</h3>
              <div style={{height:"225px"}}>
                <MapBox 
                  playlists={mapBoxPlaylists}
                  onPlaylistSelect={handlePlaylistSelect}
                />
              </div>
            </>  
            )}
          </div>

          {/* 선택된 플레이리스트 정보 */}
          {selectedPlaylist && (
            <div className='SelectPlayListInfo'>
              {/* 첫 번째 사진 */}
              
                {selectedPlaylist.photoUrls.length > 0 && (
                  <img
                    style={{width:"80px", height: "80px", margin:"10px"}}
                    src={selectedPlaylist.photoUrls[0]}
                    alt="플레이리스트 사진"
                  />
                )}
              

              <div style={{display:"flex", flexDirection:"column", justifyContent:"center", fontSize:"14px", fontWeight:600}}>
              {/* 위치 */}
                <h4 style={{margin:"0px"}}>{selectedPlaylist.locationAddress}</h4>  
              {/* 음악 */}
                <p style={{marginBottom:"0px", color:"#858585", fontSize:"12px", fontWeight:500}}>
                  {selectedPlaylist.musicDetails.trackName} - {selectedPlaylist.musicDetails.artistName}
                </p>
              </div>
              
              
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Map