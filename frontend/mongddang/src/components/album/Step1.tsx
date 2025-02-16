import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { albumStepState } from "../../recoil/albumState";
import Button from "../common/Button";
import TitleInput from "./TitleInput";
import axiosInstance from "../../api/axiosInstance"
import './Step1.css'

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

  const image = "/assets/앨범커버생성전.png";

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
      console.log("앨범 생성 완료:", data);
      setStep(2);
    } catch (error) {
      console.error("앨범 생성 중 오류 발생:", error);
      alert("앨범 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <form className="StepOnePage" onSubmit={handleSubmit}>
        <div className="step1-container">
          <TitleInput 
            title={title} 
            onChange={setTitle} 
          />
        </div>

        <div style={{marginBottom:60}}>
          <img src={image} alt="앨범커버 생성 전 기본 이미지" />
        </div>

        <div style={{width:"100%",display:"flex", justifyContent:"center"}}>
          <Button
            using="Album"
            text ={isCreating ? "생성 중..." : "생성하기"}
            disabled={!title.trim() || isCreating}
          />
        </div>
      </form>
    </>
  );
}

export default Step1;
