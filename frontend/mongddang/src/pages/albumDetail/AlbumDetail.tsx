import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth"

import axiosInstance from '../../api/axiosInstance';
import MapBox from '../../components/album/MapBox';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

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

// 앨범 생성자 정보
interface AlbumUser {
  userId: number;
  nickname: string;
  profileImageURL: string;
  introduce: string;
}

function AlbumDetail() {
  const { albumId } = useParams();
  const location = useLocation();

  const [albumData, setAlbumData] = useState<AlbumDetail | null>(location.state?.albumDetail || null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);


  const coverimage = albumData.albumImageUrl // 생성된 커버 이미지
  const lpimage = '/assets/LP판.png' // Lp 이미지

  const { userId } = useParams<{ userId: string }>(); // 앨범 생성자 정보

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열기/닫기

  // 현재 로그인한 사용자 정보
  const loggedInUser = useAuth();
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  useEffect(() => {
    if (loggedInUser) {
      setLoggedInUserId(loggedInUser.userId);
    }
  }, [loggedInUser, userId]);

  // 앨범 생성자 정보 배열로 받아오기기
  const [albumUser, setAlbumUser] = useState<AlbumUser | null>(null);

  useEffect(() => {
    const fetchAlbumCreator = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/profile/${albumData.userId}`);
        setAlbumUser(response.data); // 받아온 정보를 앨범 생성자 정보로 저장
      } catch (error) {
        console.error("앨범 생성자 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumCreator();
  }, []);

  // 선택한 플레이리스트 정보
  useEffect(() => {
    if (albumData?.playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(albumData.playlists[0].playlistId);
    }
  }, [albumData]);

  const selectedPlaylist = albumData?.playlists.find(
    playlist => playlist.playlistId === selectedPlaylistId
  );

  // MapBox에 전달할 데이터 형식 변환
  const mapBoxPlaylists = albumData.playlists.map(playlist => ({
   ...playlist,
   placeName: playlist.locationAddress,  // MapBox가 기대하는 필드명으로 변환
 }));

 // 앨범 상세 정보 조회
  useEffect(() => {
    const fetchAlbumDetail = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/albums/detail/${albumId}`);
        setAlbumData(response.data);
        console.log("앨범 상세 정보:", response.data);
      } catch (error) {
        console.error("앨범 상세 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [albumId]); // albumId가 변경될 때만 호출

  // 앨범 삭제
  const handleDeleteAlbum = async () => {
    try {
      await axiosInstance.delete(`/albums/${albumId}`);
      alert("앨범이 삭제되었습니다.");
      navigate('/mainpage'); // 메인 페이지로 이동
    } catch (error) {
      console.log(albumId);
      console.error("앨범 삭제 중 오류 발생:", error);
      alert("앨범 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
     {/* 내가 임시로 직접 스타일 지정해뒀엉..*/}

     {/* 앨범 생성자 정보 */}
      {albumUser && (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img 
            src={albumUser.profileImageURL} 
            alt="프로필 이미지" 
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            onClick={() => navigate(`/profile/${albumUser.userId}`)}
          />
          <span>{albumUser.nickname}</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{albumData.title}</h1>
        
        {/* 내 앨범일 경우 생성, 수정 버튼 활성화*/}
        <div>
          {loggedInUserId === albumData.userId && (
            <>
              <Button 
                text='수정'
                type='edit'
              />
              <Button 
                text='삭제'
                type='delete'
                onClick={() => setIsModalOpen(true)} // 모달 창 열기
              />
            </>
          )}

          {/* 모달 창 */}
          <Modal 
            isOpen={isModalOpen}
            title="앨범 삭제"
            content="해당 앨범을 삭제하시겠습니까?"
            onCancel={() => setIsModalOpen(false)}
            onConfirm={() => {
              handleDeleteAlbum();
              setIsModalOpen(false);
            }}
          />
        </div>

      </div>

      {/*겹치게 만들어서 피그마처럼 만들기...*/}  
      {/*크기를 지정하지 않으면 너무 커서 임시로 크기 설정했어요.*/}  
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img src={coverimage} alt="생성된 커버 이미지" style={{width:"150px"}}/>
        <img src={lpimage} alt="LP" style={{width:"150px"}}/>
      </div>

      <div>
        <MapBox 
          playlists={mapBoxPlaylists} 
          onPlaylistSelect={(playlistId) => setSelectedPlaylistId(playlistId)}
          />
      </div>

      <hr />
      
      <h3>플레이리스트 정보</h3>
      {selectedPlaylist && (
        <div key={selectedPlaylist.playlistId}>
          <div>
            {selectedPlaylist.photoUrls && selectedPlaylist.photoUrls.map((photo, photoIndex) => (
              <img
                key={photoIndex}
                src={photo}
                alt={`Selected Track Photo ${photoIndex + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }}
              />
            ))}
          </div>
          <p>장소: {selectedPlaylist.locationAddress}</p>
          <p>음악: {selectedPlaylist.musicDetails.trackName} - {selectedPlaylist.musicDetails.artistName}</p>
        </div>
      )}
    </div>
  );
}

export default AlbumDetail;