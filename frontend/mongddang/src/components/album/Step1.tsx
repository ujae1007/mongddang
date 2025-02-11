import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Album } from "../../types";

import axiosInstance from "../../api/axiosInstance"
import { useRecoilValue } from "recoil";
import {authTokenAtom} from "../../recoil/userAtom"


interface Step1Props {
  // 앨범 생성 완료 시 호출되는 콜백 함수
  // 앨범 생성 시 Step2로 이동하기 위해 앨범 정보를 전달
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
  const [title, setTitle] = useState<string>(""); // 앨범 제목 저장
  const [isCreating, setIsCreating] = useState(false); // 앨범 생성 여부 저장

  const setCurrentAlbum = useSetRecoilState(currentAlbumState);
  const setStep = useSetRecoilState(albumStepState);

  const token = useRecoilValue(authTokenAtom);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true); // 앨범 생성 true로 변경

    try {
      // -------------- 실제 API 호출  --------------
      const { data } = await axiosInstance.post<CreateAlbumResponse>('/albums/create', {
        title: title,
        status: false
      });

      const newAlbum: Album = {
        id: data.albumId,
        title: data.title,
        albumImageUrl: data.albumImageUrl,
        status: data.status,
        playlists: [],
      };
      // --------------------------------------------

      // ------------ 시뮬레이션 -------------

      // const newAlbum: Album = {
      //   id: Math.floor(Math.random() * 1000), // 임시 ID 생성
      //   title: title,
      //   albumImageUrl: "",
      //   status: false,
      //   playlists: [],
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      // };
      // --------------------------------------------

      console.log(token);

      setCurrentAlbum(newAlbum);
      onCreateAlbum(newAlbum);
      setStep(2);
      console.log("생성된 앨범:", newAlbum);
    } catch (error) {
      console.log(token);
      console.error("앨범 생성 중 오류 발생:", error);
      alert("앨범 생성 중 오류가 발생했습니다.");
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
            /*title 값이 변경될 때마다 상태 업데이트*/
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="앨범 제목을 입력하세요"
          />
        </div>

        <button type="submit" disabled={!title.trim() || isCreating}>
          {isCreating ? "생성 중..." : "생성하기"}
        </button>
      </form>
    </div>
  );
}

export default Step1;
