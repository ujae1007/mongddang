import { useState } from "react";

interface Step2Props {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onMoveToStep3: () => void;
  onComplete: () => void;
  onTempSave: () => void;
  albumId: number; // albumId prop 추가
}

interface CreatePlaylistResponse {
  playlistId: number;
  album: {
    albumId: number;
    userId: number;
    title: string;
    albumImageUrl: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  };
  musicId: null;
  startTime: null;
  endTime: null;
  latitude: null;
  longitude: null;
  locationAddress: null;
  photos: null;
  createdAt: string;
  updatedAt: string;
}

function Step2({
  title,
  onUpdateTitle,
  onMoveToStep3,
  onComplete,
  onTempSave,
  albumId,
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
      // -------------- 실제 API 호출 코드 (현재는 주석 처리) --------------
      // const response = await fetch(`api/playlists/${albumId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });

      // if (!response.ok) {
      //   throw new Error('플레이리스트 생성에 실패했습니다.');
      // }

      // const data: CreatePlaylistResponse = await response.json();
      // console.log('Playlist created successfully:', data);
      // -------------- 실제 API 호출 코드 끝 --------------

      // -------------- 시뮬레이션 코드 --------------
      // API 호출을 시뮬레이션하기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 가짜 응답 생성
      const mockResponse: CreatePlaylistResponse = {
        playlistId: Math.floor(Math.random() * 1000),
        album: {
          albumId: albumId,
          userId: 2,
          title: title,
          albumImageUrl: "",
          status: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        musicId: null,
        startTime: null,
        endTime: null,
        latitude: null,
        longitude: null,
        locationAddress: null,
        photos: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Playlist created successfully:', mockResponse);
      // -------------- 시뮬레이션 코드 끝 --------------

      onMoveToStep3();
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('플레이리스트 생성 중 오류가 발생했습니다.');
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
        <button 
          onClick={handleCreatePlaylist}
          disabled={isCreating}
        >
          {isCreating ? "플레이리스트 생성 중..." : "플레이리스트 만들기"}
        </button>
        <button onClick={onTempSave}>임시저장</button>
        <button onClick={onComplete}>완료</button>
      </div>
    </div>
  );
}

export default Step2;