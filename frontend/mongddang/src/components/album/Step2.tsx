import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { albumStepState } from "../../recoil/albumState";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

import TitleInput from "./TitleInput";
import Button from "../common/Button";

interface Step2Props {
  albumId: number;
  title: string;
  onUpdateTitle: (title: string) => void;
  onCreatePlaylist: (playlistId: number) => void;
  onTempSave: () => void;  // 임시저장 후 Step1으로 돌아가기
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
  albumId,
  title,
  onUpdateTitle,
  onCreatePlaylist,
  onTempSave
}: Step2Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const setStep = useSetRecoilState(albumStepState);

  const navigate = useNavigate();

  // 앨범 제목 변경
  const handleTitleChange = async (newTitle: string) => {
    try {
      setIsSaving(true);
      await axiosInstance.put(`/albums/title/${albumId}`, {
        title: newTitle
      });
      onUpdateTitle(newTitle);
    } catch (error) {
      console.error("앨범 제목 수정 중 오류 발생:", error);
      alert("제목 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 플레이리스트 생성
  const handleCreatePlaylist = async () => {
    setIsCreating(true);

    try {
      const { data } = await axiosInstance.post<CreatePlaylistResponse>(
        `/playlists/${albumId}`,
      );
      onCreatePlaylist(data);
      setStep(3);
    } catch (error) {
      console.error("플레이리스트 생성 오류", error);
      alert("플레이리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  // 임시저장
  const handleTempSave = async () => {
    const currentTitle = title;

    try {
      // 현재 제목 저장
      await axiosInstance.put(`/albums/title/${albumId}`, {
        title: currentTitle
      });
      onTempSave(); // Step1으로 돌아가기
    } catch (error) {
      console.error("임시저장 중 오류 발생:", error);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  // 앨범 생성 완료
  const handleCompleteAlbum = async () => {
    try {
      // 앨범 완료 처리
      await axiosInstance.put(`/albums/complete/${albumId}`, {
        title: title
      });
      
      // 앨범 상세 정보 조회
      const response = await axiosInstance.get(`/albums/detail/${albumId}`);
      
      // 완료 후 앨범 상세 페이지로 이동
      navigate(`/albums/${albumId}`, {
        state: { albumDetail: response.data }
      });
    } catch (error) {
      console.error("앨범 완료 처리 중 오류 발생:", error);
      alert("앨범 완료 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="step-container">
        <TitleInput
            title={title}
            onChange={handleTitleChange}
        />
      </div>

      <div>

        <Button
          type="Large"
          text="플레이리스트 만들기"
          disabled={isCreating || isSaving}
          onClick={handleCreatePlaylist} 
        />
        <div>
          <Button
            type="Large"
            text="임시저장"
            disabled={isCreating || isSaving}
            onClick={handleTempSave}
          />
          <Button
            type="Large"
            text="완료"
            disabled={isCreating || isSaving}
            onClick={handleCompleteAlbum}
          />
        </div>
      </div>

    </>
  );
}

export default Step2;
