import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Playlist } from "../../types";
import axiosInstance from "../../api/axiosInstance";

import Step3 from "../../components/album/Step3";
import Step4 from "../../components/album/Step4";

function Edit() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useRecoilState(albumStepState);
  const [album, setAlbum] = useRecoilState(currentAlbumState);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>();
  const [playlistId, setPlaylistId] = useState<number | null>(null);

  // 앨범 상세 정보 조회
  useEffect(() => {
    const fetchAlbumDetail = async () => {
      try {
        const response = await axiosInstance.get(`/albums/detail/${albumId}`);
        
        // 응답 데이터 형식 변환
        // 이렇게 해야 정보 제대로 출력 
        const albumData = {
          ...response.data,
          playlists: response.data.playlists.map((playlist: any) => ({
            playlistId: playlist.playlistId,
            photos: playlist.photoUrls,
            placeName: playlist.locationAddress,
            music: `${playlist.musicDetails.title} - ${playlist.musicDetails.artist}`,
            latitude: playlist.latitude,
            longitude: playlist.longitude,
            musicId: playlist.musicId,
            startTime: playlist.startTime,
            endTime: playlist.endTime,
            locationAddress: playlist.locationAddress
          }))
        };

        setAlbum(albumData);
        setStep(4); // 초기 화면은 플레이리스트 목록
      } catch (error) {
        console.error("앨범 상세 정보 조회 실패:", error);
        alert("앨범 정보를 불러오는데 실패했습니다.");
        navigate(-1);
      }
      4
    };

    fetchAlbumDetail();
  }, [albumId]);

  // 앨범 제목 수정
  const handleUpdateTitle = async (newTitle: string) => {
    if (album) {
      try {
        await axiosInstance.put(`/albums/title/${albumId}`, {
          title: newTitle
        });
        
        setAlbum({
          ...album,
          title: newTitle
        });
      } catch (error) {
        console.error("앨범 제목 수정 중 오류:", error);
        alert("제목 수정 중 오류가 발생했습니다.");
      }
    }
  };

  // 플레이리스트 수정
  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setStep(3);
  };

  // 플레이리스트 삭제
  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      
      if (album) {
        setAlbum({
          ...album,
          playlists: album.playlists.filter(p => p.playlistId !== playlistId)
        });
      }
    } catch (error) {
      console.error("플레이리스트 삭제 중 오류:", error);
      alert("플레이리스트 삭제 중 오류가 발생했습니다.");
    }
  };

  // 새 플레이리스트 생성
  const handleCreatePlaylist = async () => {
    try {
      const response = await axiosInstance.post(`/playlists/${albumId}`);
      setPlaylistId(response.data.playlistId);
      setStep(3);
    } catch (error) {
      console.error("플레이리스트 생성 중 오류:", error);
      alert("플레이리스트 생성 중 오류가 발생했습니다.");
    }
  };

  // 플레이리스트 수정 완료
  const handleAddPlaylist = (playlistData: Playlist) => {
    if (album) {
      const updatedPlaylists = editingPlaylist
        ? album.playlists.map(p => 
            p.playlistId === editingPlaylist.playlistId ? playlistData : p
          )
        : [...album.playlists, playlistData];

      setAlbum({
        ...album,
        playlists: updatedPlaylists
      });
      
      setEditingPlaylist(undefined);
      setPlaylistId(null);
      setStep(4);
    }
  };

  // 플레이리스트 수정 취소
  const handleCancelPlaylist = async () => {
    if (playlistId && !editingPlaylist) {
      try {
        await axiosInstance.delete(`/playlists/${playlistId}`);
      } catch (error) {
        console.error("플레이리스트 삭제 중 오류:", error);
      }
    }
    setEditingPlaylist(undefined);
    setPlaylistId(null);
    setStep(4);
  };

  // 수정 완료
  const handleComplete = async () => {
    try {
      navigate(`/albums/${albumId}`);
    } catch (error) {
      console.error("앨범 수정 완료 처리 중 오류:", error);
      alert("앨범 수정 완료 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {step === 3 && (
        <Step3
          albumId={Number(albumId)}
          playlistId={playlistId!}
          title={album.title}
          onUpdateTitle={handleUpdateTitle}
          onAddPlaylist={handleAddPlaylist}
          onCancel={handleCancelPlaylist}
          editingPlaylist={editingPlaylist}
        />
      )}

      {step === 4 && (
        <Step4
          album={album}
          onUpdateTitle={handleUpdateTitle}
          onComplete={handleComplete}
          onDeletePlaylist={handleDeletePlaylist}
          onEditPlaylist={handleEditPlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          onReset={() => {}}
          isEditMode={true}
        />
      )}
    </div>
  );
}

export default Edit;