import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Album, Playlist } from "../../types";

import { authTokenAtom } from "../../recoil/userAtom";

import Step1 from "../../components/album/Step1";
import Step2 from "../../components/album/Step2";
import Step3 from "../../components/album/Step3";
import Step4 from "../../components/album/Step4";

import TempAlbumList from "../../components/album/TempAlbumList";
import axiosInstance from "../../api/axiosInstance";
import './Create.css'
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
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>();
  const [playlistId, setPlaylistId] = useState<number | null>(null);

  const [showTempAlbums, setShowTempAlbums] = useState(false);
  const [tempAlbums, setTempAlbums] = useState<Album[]>([]);
  const [tempAlbumCount, setTempAlbumCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);


  // 로그인되지 않은 사용자가 접근할 경우 로그인 페이지로 이동
  // 로그인된 사용자의 경우 임시저장 앨범 수 조회
  useEffect(() => { 
    if (!authToken) {
      alert("로그인 후 이용하세요.");
      navigate("/login", {
        replace: true, // 뒤로가기 방지
        state: { from: "/create" }, // 로그인 후 다시 돌아올 경로
      });
    } else {
      fetchTempAlbumCount()
    }
  }, [authToken, navigate]);


  // 앨범 생성
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

  // 앨범 제목 업데이트
  const handleUpdateTitle = (newTitle: string) => {
    if (album) {
      setAlbum({
        ...album,
        title: newTitle,
      });
    }
  };

  // 앨범 생성 완료
  const handleCompleteAlbum = async (albumId: number) => {
    try {
      // 앨범 완료 처리
      await axiosInstance.put(`/albums/complete/${albumId}`, {
        title: album?.title,
      });
      
      // 앨범 상세 정보 조회
      const response = await axiosInstance.get(`/albums/detail/${albumId}`);
      const albumDetail = response.data;

      // state 초기화
      setAlbum(null);
      setStep(1)

      // 상세 페이지로 이동
      navigate(`/albums/${albumId}`, { 
        state: { albumDetail } 
      });
    } catch (error) {
      console.error("앨범 완료 처리 중 오류:", error);
    }
  };

  // 임시저장
  const handleTempSave = () => {
    setAlbum(null);
    setEditingPlaylist(undefined);
    setStep(1);
  };

  // 플레이리스트 생성 
  const handleCreatePlaylist = (playlistData: CreatePlaylistResponse) => {
    setPlaylistId(playlistData.playlistId);
    setStep(3);
  };

  // 플레이리스트 추가
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

  // 플레이리스트 편집 
  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setStep(3);
  };

  // 플레이리스트 삭제 
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

  // 플레이리스트 작업 취소
  const handleCancelPlaylist = () => {
    setEditingPlaylist(undefined);
    setPlaylistId(null);
    setStep(2);
  };

  // 임시저장 앨범 목록 조회
  const fetchTempAlbums = async () => {
    setIsLoading(true);
    try {
      console.log("Current auth token:", authToken);
      console.log("Current axios headers:", axiosInstance.defaults.headers);

      const response = await axiosInstance.get('/albums/my/uncompleted');
      setTempAlbums(response.data);
    } catch (error) {
      console.error("임시저장 앨범 조회 오류:", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  // 임시저장 목록 버튼 클릭 시 데이터 조회
  const handleShowTempAlbums = async () => {
    setShowTempAlbums(true);
    await fetchTempAlbums();
  };

  // 임시저장 앨범 선택
  const handleSelectTempAlbum = (album: Album) => {
    setAlbum(album);
    setStep(2);
    setShowTempAlbums(false);
  };

  // 임시저장 앨범 수 조회
  const fetchTempAlbumCount = async () => {
    try {
      console.log("Fetching with token:", authToken);
      const response = await axiosInstance.get('/albums/my/uncompleted');
      console.log("Server response:", response);
      setTempAlbumCount(response.data.length);
    } catch (error) {
      console.error("임시저장 앨범 수 조회 중 오류:", error);
    }
  };

  return (
    <>
      {step === 1 && !showTempAlbums && (
        <>
          <div className="TempCount">
            <a
              onClick={handleShowTempAlbums}
              style={{fontSize:"12px",color:"#9999A1"}}>
              임시저장({tempAlbumCount})
            </a>
          </div>
          <Step1 onCreateAlbum={handleCreateAlbum} />
        </>
      )}

      {step === 1 && showTempAlbums && (
        <TempAlbumList
          albums={tempAlbums}
          onSelectAlbum={handleSelectTempAlbum}
          onBack={() => setShowTempAlbums(false)}
          isLoading={isLoading}
        />
      )}

      {step === 2 && album && (
        <Step2
          albumId={album.id || 0}
          title={album.title}
          onUpdateTitle={handleUpdateTitle}
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
          onComplete={handleCompleteAlbum}
          onTempSave={handleTempSave}
          onDeletePlaylist={handleDeletePlaylist}
          onEditPlaylist={handleEditPlaylist}
          onCreatePlaylist={handleCreatePlaylist}
        />
      )}
    </>
  );
}

export default Create;