import { useState } from "react";
import { Album } from "../../types";
import axiosInstance from "../../api/axiosInstance"

interface Step1Props {
  onCreateAlbum: (album: Album) => void;
}

interface CreateAlbumResponse {
  albumId: number;
  userId: number;
  title: string;
  albumImageUrl: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  playlists: null;
}

function Step1({ onCreateAlbum }: Step1Props) {
  const [title, setTitle] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // -------------- 실제 API 호출  --------------
      // const { data } = await axiosInstance.post<CreateAlbumResponse>('/albums/create', {
      //   title: title,
      //   status: false
      // });
      
      // const newAlbum: Album = {
      //   id: data.albumId,
      //   title: data.title,
      //   album_image_URL: "",
      //   status: data.status,
      //   playlists: [],
      // };
      // --------------------------------------------

      // ------------ 시뮬레이션 -------------
      // API 호출을 시뮬레이션하기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 가짜 응답 생성
      const mockResponse: CreateAlbumResponse = {
        albumId: Math.floor(Math.random() * 1000),
        userId: 1,
        title: title,
        albumImageUrl: "",
        status: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        playlists: null
      };

      // API 응답을 Album 타입에 맞게 변환
      const newAlbum: Album = {
        id: mockResponse.albumId,
        title: mockResponse.title,
        album_image_URL: mockResponse.albumImageUrl,
        status: mockResponse.status,
        playlists: [],
      };
      // --------------------------------------------

      onCreateAlbum(newAlbum);
      console.log('생성된 앨범:', mockResponse);
      
    } catch (error) {
      console.error('앨범 생성 중 오류 발생:', error);
      alert('앨범 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">앨범 제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="앨범 제목을 입력하세요"
          />
        </div>

        <button 
          type="submit" 
          disabled={!title.trim() || isCreating}
        >
          {isCreating ? '생성 중...' : '생성하기'}
        </button>
      </form>
    </div>
  );
}

export default Step1;