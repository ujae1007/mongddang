import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import axiosInstance from '../../api/axiosInstance';
import MapBox from '../../components/album/MapBox';

interface AlbumDetail {
  title: string;
  playlists: Array<{
    playlistId: number;
    albumId: number;
    musicId: number;
    startTime: number | null;
    endTime: number | null;
    latitude: number;
    longitude: number;
    locationAddress: string;
    photoUrls: string[];
    musicDetails: {
      title: string;
      artist: string;
    };
  }>;
}
function AlbumDetail() {
  const { albumId } = useParams();
  const location = useLocation();

  const [albumData, setAlbumData] = useState<AlbumDetail | null>(location.state?.albumDetail || null);
  const [isLoading, setIsLoading] = useState(true);

  // MapBox에 전달할 데이터 형식 변환
  const mapBoxPlaylists = albumData.playlists.map(playlist => ({
   ...playlist,
   placeName: playlist.locationAddress,  // MapBox가 기대하는 필드명으로 변환
   music: `${playlist.musicDetails.artist} - ${playlist.musicDetails.title}`  // music 필드 추가
 }));

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/albums/detail/${albumId}`);
        console.log("Fetched album detail:", response.data);
        setAlbumData(response.data);
      } catch (error) {
        console.error("앨범 상세 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [albumId]); // albumId가 변경될 때만 호출


  return (
    <div style={{ width: "300px" }}>
      <h1>{albumData.title}</h1>
      <div>
        <h3> 지도 </h3>
        <MapBox playlists={mapBoxPlaylists} />
      </div>

      <hr />
      
      <h3>플레이리스트 정보</h3>
      {albumData.playlists.map((playlist, index) => (
        <div key={playlist.playlistId || index}>
          <h3>트랙 {index + 1}</h3>
          <div>
            {playlist.photoUrls && playlist.photoUrls.map((photo, photoIndex) => (
              <img
                key={photoIndex}
                src={photo}
                alt={`Track ${index + 1} Photo ${photoIndex + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }}
              />
            ))}
          </div>
          <p>장소: {playlist.locationAddress}</p>
          <p>노래: {playlist.musicDetails.artistName
          } - {playlist.musicDetails.trackName}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AlbumDetail;