import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Album, Playlist } from "../../types";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

import TitleInput from "./TitleInput";
import Button from "../common/Button";
import PlaylistItem from "./PlayListItem";
import Popup from "./Popup"

interface Step4Props {
  album: Album;
  onUpdateTitle: (newTitle: string) => void;
  onComplete: (albumId: number) => Promise<{albumImageUrl: string; albumId: number; albumDetail: any;}>;
  onTempSave: () => void;
  onDeletePlaylist: (playlistId: number) => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onCreatePlaylist: (playlistData: any) => void;
  onReset: () => void;
}

function Step4({
  album,
  onUpdateTitle,
  onComplete,
  onTempSave,
  onDeletePlaylist,
  onEditPlaylist,
  onCreatePlaylist,
  onReset
}: Step4Props) {
  const [showPopup, setShowPopup] = useState(false); //팝업 출력 여부

  const [currentTitle, setCurrentTitle] = useState(album.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false); // 플레이리스트 생성 중인지 확인 

  const currentAlbum = useRecoilValue(currentAlbumState);
  const [_, setStep] = useRecoilState(albumStepState);

  const navigate = useNavigate();

  const handleTitleChange = async (newTitle:string) => {
    setCurrentTitle(newTitle);
    
    try {
      // 앨범 제목 변경 API 호출
      await axiosInstance.put(`/albums/title/${album.albumId}`, {
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
        `/playlists/${album.albumId}`,
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

  const handleComplete = async () => {
    try {

      // 완료 버튼을누르면
      setShowPopup(true); // 팝업 표시

      // 앨범 완료 처리 및 정보 받아오기
      const { albumDetail } = await onComplete(album.albumId);

      // 응답 데이터 받으면
      navigate(`/albums/${album.albumId}`, {
        state: { albumDetail: albumDetail }});
      
      // 리셋
      onReset();

      console.log("앨범 완료 처리", album);
    } catch (error) {
      console.error("앨범 완료 처리 중 오류:", error);
      alert("앨범 완료 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <TitleInput
      title={currentTitle}
      onChange={handleTitleChange}
      />

      <div>
      {album.playlists.map((playlist, index) => {
        return (
          <PlaylistItem
            key={playlist.playlistId || index}
            playlist={playlist}
            index={index}
            onEdit={onEditPlaylist}
            onDelete={handleDeletePlaylist}
            isDeleting={isDeleting}
          />
          );
        })}
      </div>

      <div>
      {album.playlists.length < 5 && (
          <Button
            type="Large"
            onClick={handleMoveToStep3}
            disabled={isCreatingPlaylist}
            text={isCreatingPlaylist ? "플레이리스트 생성 중..." : "플레이리스트 추가"}
          />
      )}
      </div>
      <>
      <Button
        type="Large"
        onClick={onTempSave}
        text="임시저장"
      />
      <Button
        type="Large"
        onClick={handleComplete}
        text="생성완료"
      />

      <div>
        {showPopup && <Popup isLoading={true} />}
      </div>
      </>

    </div>
  );
}

export default Step4;
