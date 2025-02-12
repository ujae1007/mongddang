import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { albumStepState } from "../../recoil/albumState";
import axiosInstance from "../../api/axiosInstance"

interface Step1Props {
  // 앨범 생성 시 Step2로 이동하기 위해 앨범 정보를 전달
  onCreateAlbum: (albumId: number, title: string) => void;
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
  const setStep = useSetRecoilState(albumStepState); // 앨범 생성 단계 저장

  // 앨범 생성 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true); // 앨범 생성 true로 변경

    try {
      // 앨범 생성 API 호출
      const { data } = await axiosInstance.post<CreateAlbumResponse>('/albums/create', {
        title: title,
        status: false
      });

      onCreateAlbum(data.albumId, data.title); // 앨범 생성 후 response로 받은 데이터를 Step2로 전달
      setStep(2);
      console.log("생성된 앨범:", data);
    } catch (error) {
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
