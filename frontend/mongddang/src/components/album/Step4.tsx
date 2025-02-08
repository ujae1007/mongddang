import { useState } from "react";
import { Album, Playlist } from "../../types";
// import axiosInstance from "../../api/axiosInstance";

interface Step4Props {
  album: Album;
  onUpdateTitle: (newTitle: string) => void;
  onMoveToStep3: () => void;
  onComplete: (albumId: number) => void;
  onTempSave: () => void;
  onDeletePlaylist: (playlistId: number) => void;
  onEditPlaylist: (playlist: Playlist) => void;
}

function Step4({
  album,
  onUpdateTitle,
  onMoveToStep3,
  onComplete,
  onTempSave,
  onDeletePlaylist,
  onEditPlaylist,
}: Step4Props) {
  const [currentTitle, setCurrentTitle] = useState(album.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
    onUpdateTitle(newTitle);
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      // -------------- 실제 API 호출 --------------
      // await axiosInstance.delete(`/playlists/${playlistId}`);
      // -------------------------------------------

      // -------------- 시뮬레이션 --------------
      await new Promise((resolve) => setTimeout(resolve, 500));
      // ------------------------------------------

      // API 호출 성공 후 UI 업데이트
      onDeletePlaylist(playlistId);
    } catch (error) {
      console.error("플레이리스트 삭제 중 오류 발생:", error);
      alert("플레이리스트 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
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
        <button onClick={onMoveToStep3}>플레이리스트 추가</button>
      )}

      <button onClick={onTempSave}>임시저장</button>

      <button onClick={() => onComplete(album.albumId || 0)}>완료</button>
    </div>
  );
}

export default Step4;
