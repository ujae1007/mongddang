import { useState } from "react";
import { Album, Playlist } from "../../types";

interface Step4Props {
  album: Album;
  onUpdateTitle: (newTitle: string) => void;
  onMoveToStep3: () => void;
  onComplete: () => void;
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
    onUpdateTitle(newTitle);
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
          <div key={playlist.id}>
            <img
              src={playlist.imageUrl}
              alt={`Track ${index + 1}`}
              style={{ width: "100px", height: "100px", cursor: "pointer" }}
              onClick={() => onEditPlaylist(playlist)}
              title="클릭하여 수정"
            />
            <span>트랙 {index + 1} / </span>
            <span>{playlist.placeName} / </span>
            <span>{playlist.music}</span>
            <button onClick={() => onDeletePlaylist(playlist.id)}>삭제</button>
          </div>
        ))}
      </div>

      {album.playlists.length < 5 && (
        <button onClick={onMoveToStep3}>플레이리스트 추가</button>
      )}

      <button onClick={onTempSave}>임시저장</button>

      <button onClick={onComplete}>완료</button>
    </div>
  );
}

export default Step4;