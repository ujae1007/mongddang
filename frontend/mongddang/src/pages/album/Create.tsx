import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { albumListState, currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Album, Playlist } from "../../types";

import { authTokenAtom } from "../../recoil/userAtom";

import Step1 from "../../components/album/Step1";
import Step2 from "../../components/album/Step2";
import Step3 from "../../components/album/Step3";
import Step4 from "../../components/album/Step4";
import TempAlbumList from "../../components/album/TempAlbumList";

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

function Create() {
  const navigate = useNavigate();
  const authToken = useRecoilValue(authTokenAtom);

  const [step, setStep] = useRecoilState(albumStepState);
  const [album, setAlbum] = useRecoilState(currentAlbumState);
  const [createdAlbums, setCreatedAlbums] = useRecoilState(albumListState);
  const [showTempAlbums, setShowTempAlbums] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>();
  const [playlistId, setPlaylistId] = useState<number | null>(null);

  const tempAlbums = createdAlbums.filter((album) => !album.status);

  // 로그인되지 않은 사용자가 접근할 경우 로그인 페이지로 이동
  useEffect(() => { 
    if (!authToken) {
      alert("로그인 후 이용하세요.");
      navigate("/login", {
        replace: true, // 뒤로가기 방지
        state: { from: "/create" }, // 로그인 후 다시 돌아올 경로로
      });
    }
  }, [authToken, navigate]);

  const resetToStep1 = (isSaveTemp: boolean = false) => {
    if (album) {
      const savedAlbum = {
        ...album,
        status: !isSaveTemp,
      };

      setCreatedAlbums((prev) => {
        const existingAlbumIndex = prev.findIndex(
          (a) => a.title === savedAlbum.title
        );

        if (existingAlbumIndex !== -1) {
          const newAlbums = [...prev];
          newAlbums[existingAlbumIndex] = savedAlbum;
          return newAlbums;
        } else {
          return [...prev, savedAlbum];
        }
      });
    }

    setAlbum(null);
    setEditingPlaylist(undefined);
    setStep(1);
    setShowTempAlbums(false);
  };

  const handleCreateAlbum = (albumId: number, title: string) => {
    setAlbum({
      id: albumId,
      title: title,
      albumImageUrl: "",
      status: false,
      playlists: [],
    });
    setStep(2);
  };

  const handleSelectTempAlbum = (selectedAlbum: Album) => {
    setAlbum(selectedAlbum);
    setShowTempAlbums(false);
    setStep(4);
  };

  const handleUpdateTitle = (newTitle: string) => {
    if (album) {
      setAlbum({
        ...album,
        title: newTitle,
      });
    }
  };

  const handleCompleteAlbum = () => {
    if (album) {
      // 현재 앨범의 상태를 완료로 변경
      const completedAlbum = {
        ...album,
        status: true,
        updatedAt: new Date().toISOString(),
      };

      // createdAlbums 배열 업데이트
      setCreatedAlbums((prev) => {
        const existingAlbumIndex = prev.findIndex(
          (a) => a.id === completedAlbum.id
        );

        if (existingAlbumIndex !== -1) {
          // 기존 앨범 업데이트
          const newAlbums = [...prev];
          newAlbums[existingAlbumIndex] = completedAlbum;
          return newAlbums;
        } else {
          // 새 앨범 추가
          const newAlbums = [...prev, completedAlbum];
          return newAlbums;
        }
      });

      // step1으로 상태 변경 및 앨범 정보 초기화
      setAlbum(null);
      setStep(1);

      console.log("앨범 생성 완료:", completedAlbum);

      // 해당 앨범 상세 페이지로 이동
      navigate(`/albums/${completedAlbum.id}`);
    }
  };

  const handleTempSave = () => {
    resetToStep1(true);
  };

  const handleCreatePlaylist = (playlistData: CreatePlaylistResponse) => {
    setPlaylistId(playlistData.playlistId);
    setStep(3);
  };

  const handleAddPlaylist = (playlistData: Playlist) => {
    if (album) {
      if (editingPlaylist) {
        const updatedPlaylists = album.playlists.map((playlist) =>
          playlist.playlistId === editingPlaylist.playlistId
            ? playlistData
            : playlist
        );
        setAlbum({
          ...album,
          playlists: updatedPlaylists,
        });
        setEditingPlaylist(undefined);
      } else {
        setAlbum({
          ...album,
          playlists: [...album.playlists, playlistData],
        });
      }
      setPlaylistId(null);
      setStep(4);
    }
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setStep(3);
  };

  const handleDeletePlaylist = (playlistId: number) => {
    if (album) {
      const updatedPlaylists = album.playlists
        .filter((playlist) => playlist.playlistId !== playlistId)
        .map((playlist, index) => ({
          ...playlist,
          playlistId: index,
        }));

      setAlbum({
        ...album,
        playlists: updatedPlaylists,
      });
    }
  };

  const handleCancelPlaylist = () => {
    setEditingPlaylist(undefined);
    setPlaylistId(null);
    setStep(2);
  };

  return (
    <div>

      {step === 1 && !showTempAlbums && (
        <>
          <Step1 onCreateAlbum={handleCreateAlbum} />
          {tempAlbums.length > 0 && (
            <a onClick={() => setShowTempAlbums(true)}>
              임시저장({tempAlbums.length})
            </a>
          )}
        </>
      )}

      {step === 1 && showTempAlbums && (
        <TempAlbumList
          albums={tempAlbums}
          onSelectAlbum={handleSelectTempAlbum}
          onBack={() => setShowTempAlbums(false)}
        />
      )}

      {step === 2 && album && (
        <Step2
          albumId={album.id || 0}
          title={album.title}
          onUpdateTitle={handleUpdateTitle}
          onComplete={() => handleCompleteAlbum()}
          onTempSave={handleTempSave}
          onCreatePlaylist={handleCreatePlaylist}
        />
      )}

      {step === 3 && album && (
        <Step3
          albumId={album.id!}
          playlistId={playlistId!}
          title={album.title}
          onUpdateTitle={handleUpdateTitle}
          onAddPlaylist={handleAddPlaylist}
          onCancel={handleCancelPlaylist}
          editingPlaylist={editingPlaylist}
        />
      )}

      {step === 4 && album && (
        <Step4
          album={album}
          onUpdateTitle={handleUpdateTitle}
          onComplete={() => handleCompleteAlbum()}
          onTempSave={handleTempSave}
          onDeletePlaylist={handleDeletePlaylist}
          onEditPlaylist={handleEditPlaylist}
        />
      )}
    </div>
  );
}

export default Create;
