import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth"

import axiosInstance from '../../api/axiosInstance';
import MapBox from '../../components/album/MapBox';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Comment from '../../components/comment/Comment';

import YoutubePlayer from '../youtube/youtubePrac';

import './AlbumDetail.css';

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

  const [albumData, setAlbumData] = useState<AlbumDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null); // 선택한 플레이리스트 아이디
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState<number | null>(null); // 선택한 플레이리스트 인덱스

  const lpimage = '/assets/LP판.png' // Lp 이미지

  const { userId } = useParams<{ userId: string }>(); // 앨범 생성자 정보

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열기/닫기

  const [isLiked, setIsLiked] = useState(false); // 좋아요 여부

  const likeIcon = "/assets/안좋아요.svg"; // 좋아요 누르기 전 
  const likedIcon = "/assets/좋아요.svg"  // 좋아요 누른 후

  const line = "/assets/구분선.svg"; // 구분선 이미지

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // iframe 및 사진 중 현재 선택한 미디어의 인덱스 정보


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
        setIsLiked(response.data.liked); // 좋아요 여부 저장
        console.log("앨범 상세 정보 - 좋아요 확인용:", response.data);
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
          setAlbumUser(response.data); // 받아온 앨범 생성자 정보 저장
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
      setSelectedPlaylistIndex(0);
    }
  }, [albumData]);

  const selectedPlaylist = albumData?.playlists.find(
    playlist => playlist.playlistId === selectedPlaylistId
  );

  // 플레이리스트를 선택하면 해당 인덱스도 함께 업데이트
  const handlePlaylistSelect = (playlistId: number) => {
    setSelectedPlaylistId(playlistId);
    // playlists 배열에서 선택한 플레이리스트의 인덱스 찾기
    const playlistIndex = albumData?.playlists.findIndex(
      playlist => playlist.playlistId === playlistId
    );
    setSelectedPlaylistIndex(playlistIndex);
  }
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

  // 좋아요
  const handleLike = async () => {
    try{
      if(isLiked){
        // 좋아요 취소
        await axiosInstance.delete(`/like/${albumId}`);
      } else {
        // 좋아요 
        await axiosInstance.post(`/like/${albumId}`);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
   }
  }

  return (
    <>
      {/* albumData가 있을 때만 렌더링 */}
      {albumData && (
        <>
          <div className='detailContainer'>
            {/* 앨범 생성자 정보 */}
            {albumUser && (
              <>
              <div className='profileContainer'>
                <div className='profileInfo'>
                  <img
                    className='profileImg'
                    src={albumUser.profileImageURL} 
                    alt="프로필 이미지" 
                    onClick={() => navigate(`/profile/${albumUser.userId}`)}
                  />
                  <p className='profileNickname'>{albumUser.nickname}</p>
                </div>
              <div className='likeButton'>
                <img 
                  className='likeIcon'
                  src={isLiked ? likedIcon : likeIcon}
                  alt={isLiked ? "좋아요 취소" : "좋아요"}
                  onClick={handleLike}
                />
              </div>
              </div>
              </>
            )}

            {/* 앨범 제목 및 수정 삭제 버튼 */}
            <div className='titleContainer'>
            <h1 className='titleInfo'>{albumData.title}</h1> 
              <div className='buttonContainer'>
                {loggedInUserId === albumData.userId && (
                  <div className='buttonItem'>
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
                  </div>
                )}
              </div>

              
            </div>
            
            {/* 생성된 앨범 커버와 LP */}
            <div className='lpContainer'>
              <div className='lpWithCover'>
                <img src={albumData.albumImageUrl} alt="생성된 커버 이미지" className='coverImg'/>
                <img src={lpimage} alt="LP" className='lpImg'/>
              </div>
            </div>
          </div>
      
          <img src={line} alt="" style={{marginBottom:"10px", marginTop:"10px"}}/>

          {/* MapBox */}
          <div style={{ height: '300px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <MapBox
              playlists={mapBoxPlaylists} 
              onPlaylistSelect={handlePlaylistSelect}
            />
          </div>

          <img src={line} alt="" style={{marginBottom:"10px", marginTop:"10px"}}/>
          
          {selectedPlaylist && (
            <div key={selectedPlaylist.playlistId}>
                {/* 선택된 플레이리스트 장소명*/}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}>
                  <img src="/assets/지도마커2.svg" alt="" style={{width:"18px"}}/>
                  <h4>{selectedPlaylist.locationAddress}</h4>
                </div>
                {/* 이미지 및 iframe*/}
                {/* <div>
                  {selectedPlaylist.photoUrls && selectedPlaylist.photoUrls.map((photo, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={photo}
                      alt={`Selected Track Photo ${photoIndex + 1}`}
                      style={{ width: "200px", height: "200px", objectFit: "cover", margin: "5px" }}
                    />
                  ))}
                  <YoutubePlayer 
                    playlistIndex = {selectedPlaylistIndex}/>
                </div> */}

                {/* 슬라이더 */}

                <div className="sliderContainer">
                  {/* 이전버튼 */}
                  <button 
                    onClick={() => {
                      const totalItems = selectedPlaylist.photoUrls.length + 1; // 이미지와 iframe을 합친 총 아이템 수
                      setCurrentMediaIndex(prev => prev === 0 ? totalItems - 1 : prev - 1);
                    }}
                    className='sliderButton'
                  >
                    <img src="/assets/이전버튼.svg" alt="이전버튼" className='sliderArrow' />
                  </button>

                  {/* 이미지 및 iframe */}
                  <div className='mediaContainer'>
                    {[
                      {
                        type: 'youtube',
                        content : <YoutubePlayer playlistIndex={selectedPlaylistIndex} />
                      },
                      ...selectedPlaylist.photoUrls.map(url => ({
                        type: 'image',
                        content: (
                          <img
                            src={url}
                            alt="이미지"
                            className='mediaImage'
                          />
                        )
                      }))
                    ].map((item, index) => {
                      const isSelect = currentMediaIndex === index;
                      return (
                        <div
                          key={index}
                          className={`mediaItem ${isSelect ? 'selected' : ''}`}
                        >
                          {item.content}
                          {!isSelect && <div className='mediaOverlay'/>}
                        </div>
                      )
                    })}
                  </div>
                    
                  {/* 다음버튼 */}
                  <button 
                    onClick={() => {
                      const totalItems = selectedPlaylist.photoUrls.length + 1; // 이미지와 iframe을 합친 총 아이템 수
                      setCurrentMediaIndex(prev => prev === totalItems - 1 ? 0 : prev + 1);
                    }}
                    className='sliderButton'
                  >
                    <img src="/assets/다음버튼.svg" alt="다음버튼" className='sliderArrow' />
                  </button>

                </div>

                {/*음악정보*/}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}>
                  <img src="/assets/음표.svg" alt="" style={{width:"16px"}}/>
                  <p>{selectedPlaylist.musicDetails.trackName} - {selectedPlaylist.musicDetails.artistName}</p>
                </div>

            </div>
          )}

          <img src={line} alt="" style={{marginBottom:"10px", marginTop:"10px"}}/>

          {/*댓글*/}
          {loggedInUser && (
            <div style={{ marginBottom: "70px" }}>
              <Comment 
                albumId={Number(albumId)}
                userProfileImage={loggedInUser.profileImageURL}
              />
            </div>
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
    </>
  );
}

export default AlbumDetail;