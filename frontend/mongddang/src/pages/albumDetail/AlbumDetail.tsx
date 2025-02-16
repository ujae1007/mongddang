import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth"

import axiosInstance from '../../api/axiosInstance';
import MapBox from '../../components/album/MapBox';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Comment from '../../components/comment/Comment';

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

  const [albumData, setAlbumData] = useState<AlbumDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

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

   // 앨범 상세 정보 조회
   useEffect(() => {
    const fetchAlbumDetail = async () => {
      setIsLoading(true);
      console.log("앨범 상세 정보 조회 시도");
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

    if(albumId) {
      fetchAlbumDetail();
    }
  }, [albumId]); // albumId가 변경될 때만 호출

  // 앨범 생성자 정보 받아오기
  const [albumUser, setAlbumUser] = useState<AlbumUser | null>(null);

  useEffect(() => {
    const fetchAlbumCreator = async () => {
      if (albumData?.userId) {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(`/profile/${albumData.userId}`);
          setAlbumUser(response.data); // 받아온 앨범 생성자 정보 저장장
        } catch (error) {
          console.error("앨범 생성자 정보 조회 실패:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAlbumCreator();
  }, [albumData]);

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
  const mapBoxPlaylists = albumData?.playlists?.map(playlist => ({
   ...playlist,
   placeName: playlist.locationAddress,  // MapBox가 기대하는 필드명으로 변환
 })) || [];

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
      {/* albumData가 있을 때만 렌더링 */}
      {albumData && (
        <>
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

          {/* 앨범 제목 및 수정 삭제 버튼 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>{albumData.title}</h1>
            
            <div>
              {loggedInUserId === albumData.userId && (
                <>
                  <Button 
                    text='수정'
                    type='edit'
                    onClick={() => navigate(`/edit/${albumId}`)}
                  />
                  <Button 
                    text='삭제'
                    type='delete'
                    onClick={() => setIsModalOpen(true)}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* 생성된 앨범 커버와 LP */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img src={albumData.albumImageUrl} alt="생성된 커버 이미지" style={{width:"150px"}}/>
            <img src={lpimage} alt="LP" style={{width:"150px"}}/>
          </div>

          {/* MapBox */}
          {mapBoxPlaylists.length > 0 && (
            <div>
              <MapBox 
                playlists={mapBoxPlaylists} 
                onPlaylistSelect={(playlistId) => setSelectedPlaylistId(playlistId)}
              />
            </div>
          )}
          <hr />
          
          {selectedPlaylist && (
            <div key={selectedPlaylist.playlistId}>
                {/* 선택된 플레이리스트 장소명*/}
                <div>
                  <img src="/assets/지도마커2.svg" alt="" />
                  <h4>{selectedPlaylist.locationAddress}</h4>
                </div>
                {/* 이미지 */}
                {/* 이후 유튭 ifrme 연결 예정 */}
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
                <div>
                {/*음악정보보*/}
                <div>
                  <img src="/assets/음표.svg" alt="" />
                  <p>{selectedPlaylist.musicDetails.trackName} - {selectedPlaylist.musicDetails.artistName}</p>
                </div>
                </div>
            </div>
          )}

          {/*댓글*/}
          {loggedInUser && (
          <Comment 
            albumId={Number(albumId)}
            userProfileImage={loggedInUser.profileImageURL}
          />
          )}

        </>
      )}

      {/* 모달은 albumData 존재와는 별도로 위치 */}
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
  );
}

export default AlbumDetail;