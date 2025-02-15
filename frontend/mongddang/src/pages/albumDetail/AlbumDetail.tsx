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

  const image = "/assets/앨범커버생성전.png"; // 앨범 커버 이미지 생성 기능 추가하면 변경 예정 

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


      <div>
        <img src={image} alt="앨범커버 생성 전 기본 이미지" />
      </div>

      <div>
        {/* <MapBox playlists={mapBoxPlaylists} /> */}
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
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AlbumDetail;