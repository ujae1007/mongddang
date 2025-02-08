import { useState } from "react";
// import axiosInstance from "../../api/axiosInstance";

interface Step2Props {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onMoveToStep3: () => void;
  onComplete: (albumId: number) => void;
  onTempSave: () => void;
  albumId: number;
}

// interface CreatePlaylistResponse {
//   playlistId: number;
//   album: {
//     albumId: number;
//     userId: number;
//     title: string;
//     albumImageUrl: string;
//     status: boolean;
//     createdAt: string;
//     updatedAt: string;
//   };
//   musicId: null;
//   startTime: null;
//   endTime: null;
//   latitude: null;
//   longitude: null;
//   locationAddress: null;
//   photos: null;
//   createdAt: string;
//   updatedAt: string;
// }

function Step2({
  albumId,
  title,
  onUpdateTitle,
  onMoveToStep3,
  onComplete,
  onTempSave,
}: Step2Props) {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isCreating, setIsCreating] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
    onUpdateTitle(newTitle);
  };

  const handleCreatePlaylist = async () => {
    setIsCreating(true);

    try {
      // -------------- 실제 API 호출--------------
      // const { data } = await axiosInstance.post<CreatePlaylistResponse>(
      //   `/playlists/${albumId}`,
      //   {musicId: null,
      //   startTime: null,
      //   endTime: null,
      //   latitude: null,
      //   longitude: null,
      //   locationAddress: null,
      //   photos: null
      // }
      // );
      // console.log('생성된 플레이리스트', data);
      // -------------------------------------------

      onMoveToStep3();
    } catch (error) {
      console.error("플레이리스트 생성 오류", error);
      alert("플레이리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCreating(false);
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
        <button onClick={handleCreatePlaylist} disabled={isCreating}>
          {isCreating ? "플레이리스트 생성 중..." : "플레이리스트 만들기"}
        </button>
        <button onClick={onTempSave}>임시저장</button>
        <button onClick={() => onComplete(albumId)}>완료</button>
      </div>
    </div>
  );
}

export default Step2;
