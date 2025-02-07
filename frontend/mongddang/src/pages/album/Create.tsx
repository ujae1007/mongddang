import { useState } from "react";
import { Album, Playlist } from "../../types";
import Step1 from "../../components/album/Step1";
import Step2 from "../../components/album/Step2";
import Step3 from "../../components/album/Step3";
import Step4 from "../../components/album/Step4";
import TempAlbumList from "../../components/album/TempAlbumList";

function Create() {
  const [step, setStep] = useState<number>(1);
  const [album, setAlbum] = useState<Album | null>(null);
  const [currentAlbumId, setCurrentAlbumId] = useState<number>(0);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<number>(0);
  const [createdAlbums, setCreatedAlbums] = useState<Album[]>([]);
  const [showTempAlbums, setShowTempAlbums] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>();

  const tempAlbums = createdAlbums.filter((album) => !album.status);

  const resetToStep1 = (isSaveTemp: boolean = false) => {
    if (album) {
      const savedAlbum = {
        ...album,
        status: !isSaveTemp,
      };

      setCreatedAlbums((prev) => {
        const existingAlbumIndex = prev.findIndex(
          (a) => a.id === savedAlbum.id
        );

        if (existingAlbumIndex !== -1) {
          const newAlbums = [...prev];
          newAlbums[existingAlbumIndex] = savedAlbum;
          console.log("Updated Album in Created Albums:", newAlbums);
          return newAlbums;
        } else {
          const newAlbums = [...prev, savedAlbum];
          console.log("Added New Album to Created Albums:", newAlbums);
          return newAlbums;
        }
      });
    } else {
      console.log("All Created Albums:", createdAlbums);
    }
    setAlbum(null);
    setEditingPlaylist(undefined);
    setStep(1);
    setShowTempAlbums(false);
  };

  const handleCreateAlbum = (newAlbum: Album) => {
    const albumWithId = {
      ...newAlbum,
      id: currentAlbumId,
    };
    setAlbum(albumWithId);
    setCurrentAlbumId((prev) => prev + 1);
    console.log("Created Album:", albumWithId);
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
    resetToStep1(false);
  };

  const handleTempSave = () => {
    resetToStep1(true);
  };

  const handleAddPlaylist = (playlistData: Omit<Playlist, "id">) => {
    if (album) {
      if (editingPlaylist) {
        // 플레이리스트 수정
        const updatedPlaylists = album.playlists.map(playlist => 
          playlist.id === editingPlaylist.id
            ? { ...playlistData, id: editingPlaylist.id }
            : playlist
        );

        setAlbum({
          ...album,
          playlists: updatedPlaylists,
        });
        setEditingPlaylist(undefined);
      } else {
        // 새 플레이리스트 추가
        const newPlaylist = {
          ...playlistData,
          id: currentPlaylistId,
        };

        setAlbum({
          ...album,
          playlists: [...album.playlists, newPlaylist],
        });
        setCurrentPlaylistId((prev) => prev + 1);
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
        .filter((playlist) => playlist.id !== playlistId)
        .map((playlist, index) => ({
          ...playlist,
          id: index,
        }));

      setAlbum({
        ...album,
        playlists: updatedPlaylists,
      });
      setCurrentPlaylistId(updatedPlaylists.length);
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
          title={album.title}
          onUpdateTitle={handleUpdateTitle}
          onMoveToStep3={() => setStep(3)}
          onComplete={handleCompleteAlbum}
          onTempSave={handleTempSave}
        />
      )}

      {step === 3 && album && (
        <Step3
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
          onMoveToStep3={() => setStep(3)}
          onComplete={handleCompleteAlbum}
          onTempSave={handleTempSave}
          onDeletePlaylist={handleDeletePlaylist}
          onEditPlaylist={handleEditPlaylist}
        />
      )}
    </div>
  );
}

export default Create;