import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Album, Playlist } from "../../types";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Step4Props {
  album: Album;
  onUpdateTitle: (newTitle: string) => void;
  onComplete: (albumId: number) => void;
  onTempSave: () => void;
  onDeletePlaylist: (playlistId: number) => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onCreatePlaylist: (playlistData: any) => void;
}

function Step4({
  album,
  onUpdateTitle,
  onComplete,
  onTempSave,
  onDeletePlaylist,
  onEditPlaylist,
  onCreatePlaylist
}: Step4Props) {
  const [currentTitle, setCurrentTitle] = useState(album.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false); // 플레이리스트 생성 중인지 확인 

  const currentAlbum = useRecoilValue(currentAlbumState);
  const [_, setStep] = useRecoilState(albumStepState);

  const navigate = useNavigate();

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
    
    try {
      // 앨범 제목 변경 API 호출
      await axiosInstance.put(`/albums/title/${album.id}`, {
        title: newTitle
      });
      
      // 부모 컴포넌트의 타이틀 업데이트 함수 호출
      onUpdateTitle(newTitle);
    } catch (error) {
      console.error("앨범 제목 수정 중 오류 발생:", error);
      alert("제목 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);

      // API 호출 성공 후 UI 업데이트
      onDeletePlaylist(playlistId);
    } catch (error) {
      console.error("플레이리스트 삭제 중 오류 발생:", error);
      alert("플레이리스트 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveToStep3 = async () => {
    setIsCreatingPlaylist(true);
    try {
      // 플레이리스트 생성 API 호출
      const { data } = await axiosInstance.post(
        `/playlists/${album.id}`,
      );
      console.log('생성된 플레이리스트:', data);
      // 생성된 플레이리스트 데이터를 부모 컴포넌트로 전달
      onCreatePlaylist(data);
      // Step3로 이동
      setStep(3);
    } catch (error) {
      console.error("플레이리스트 생성 오류:", error);
      alert("플레이리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="title">앨범 제목</label>
        <input
          type="text"
          id="title"
          value={currentTitle}
          onChange={handleTitleChange}
        />
      </div>

      <div>
        {album.playlists.map((playlist, index) => (
          <div key={playlist.playlistId || index}>
            {playlist.photos &&
              playlist.photos.map((photo, photoIndex) => (
                <img
                  key={`${playlist.playlistId}-photo-${photoIndex}`}
                  src={photo}
                  alt={`Track ${index + 1} Photo ${photoIndex + 1}`}
                  style={{ width: "100px", height: "100px", cursor: "pointer" }}
                  onClick={() => onEditPlaylist(playlist)}
                />
              ))}
            <span>트랙 {index + 1} / </span>
            <span>{playlist.placeName} / </span>
            <span>{playlist.music}</span>
            <button
              onClick={() => handleDeletePlaylist(playlist.playlistId || 0)}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        ))}
      </div>

      {album.playlists.length < 5 && (
        <button 
          onClick={handleMoveToStep3}
          disabled={isCreatingPlaylist} // 플레이리스트 생성 중일 때 비활성화
        >
            {isCreatingPlaylist ? "플레이리스트 생성 중..." : "플레이리스트 추가"}
          
        </button>
      )}

      <button onClick={onTempSave}>임시저장</button>

      <button onClick={async () => {
          try {
            // 앨범 완료 처리
            await axiosInstance.put(`/albums/complete/${album.id}`, {
              title: currentTitle
            });
            
            // 앨범 상세 정보 조회
            const response = await axiosInstance.get(`/albums/detail/${album.id}`);
            const albumDetail = response.data;
            console.log("앨범 상세 정보:", albumDetail);
            
            // 상세 페이지로 이동 (상태와 함께)
            navigate(`/albums/${album.id}`, { 
              state: { albumDetail } 
            });
          } catch (error) {
            console.error("앨범 완료 처리 중 오류:", error);
          }
        }}>완료</button>
    </div>
  );
}

export default Step4;
