import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { albumListState, currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Album, Playlist } from "../../types";
import Step1 from "../../components/album/Step1";
import Step2 from "../../components/album/Step2";
import Step3 from "../../components/album/Step3";
import Step4 from "../../components/album/Step4";
import TempAlbumList from "../../components/album/TempAlbumList";

function Create() {
  const navigate = useNavigate();

  const [step, setStep] = useRecoilState(albumStepState);
  const [album, setAlbum] = useRecoilState(currentAlbumState);
  const [createdAlbums, setCreatedAlbums] = useRecoilState(albumListState);
  const [showTempAlbums, setShowTempAlbums] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>();
  
  console.log("전체 앨범",createdAlbums); // 지금까지 생성된 앨범 목록

  const tempAlbums = createdAlbums.filter((album) => !album.status);

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

  const handleCreateAlbum = (newAlbum: Album) => {
    setAlbum(newAlbum);
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

      // step1으로 돌아가기
      setAlbum(null);
      setStep(1);

      console.log("앨범 생성 완료:", completedAlbum);

      // 해당 앨범 상세 페이지로 이동
      navigate(`/albums/${completedAlbum.id}`, {state: completedAlbum});
    }
  };

  const handleTempSave = () => {
    resetToStep1(true);
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
    setStep(2);
  };

  return (
    <div>
      <h1>앨범 생성</h1>

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
        />
      )}

      {step === 3 && album && (
        <Step3
          albumId={album.id!}
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
