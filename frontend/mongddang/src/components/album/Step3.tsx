import { useState, useRef, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentAlbumState, albumStepState } from "../../recoil/albumState";
import { Playlist } from "../../types";
import SearchLocation from "./SearchLocation";
import SearchMusic from "./SearchMusic";
// import axiosInstance from "../../api/axiosInstance";

interface Step3Props {
  albumId: number;
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onAddPlaylist: (playlistData: Playlist) => void;
  onCancel: () => void;
  editingPlaylist?: Playlist;
}

function Step3({
  title,
  onUpdateTitle,
  onAddPlaylist,
  onCancel,
  editingPlaylist,
}: Step3Props) {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [music, setMusic] = useState(editingPlaylist?.music || "");
  const [placeName, setPlaceName] = useState(editingPlaylist?.placeName || "");
  const [address, setAddress] = useState(editingPlaylist?.address || "");
  const [latitude, setLatitude] = useState(editingPlaylist?.latitude || 0);
  const [longitude, setLongitude] = useState(editingPlaylist?.longitude || 0);
  const [imageUrls, setImageUrls] = useState<string[]>(
    editingPlaylist?.photos || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAlbum = useRecoilValue(currentAlbumState);
  const [_, setStep] = useRecoilState(albumStepState);

  // 장소 정보가 변경될 때 노래 정보 초기화
  useEffect(() => {
    if (!placeName) {
      setMusic("");
    }
  }, [placeName]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
    onUpdateTitle(newTitle);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // 최대 5장까지만 허용
        if (imageUrls.length < 5) {
          setImageUrls((prev) => [...prev, imageUrl]);
        } else {
          alert("최대 5장의 이미지만 업로드 가능합니다.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleSelectPlace = (place: {
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setPlaceName(place.placeName);
    setAddress(place.address);
    setLatitude(place.latitude);
    setLongitude(place.longitude);
  };

  const handleClearPlace = () => {
    setPlaceName("");
    setAddress("");
    setLatitude(0);
    setLongitude(0);
    setMusic(""); // 장소 삭제 시 노래 정보도 초기화
  };

  const handleSubmit = async () => {
    try {
      // -------------- 실제 API 호출 --------------
      // const playlistData = {
      //   photos: imageUrls,
      //   latitude: latitude,
      //   longitude: longitude,
      //   locationAddress: placeName,
      //   musicId: music,
      // };

      // // 수정인 경우 (editingPlaylist가 존재하는 경우)
      // if (editingPlaylist) {
      //   const response = await axiosInstance.put(
      //     `/api/playlists/${editingPlaylist.playlistId}`,
      //     playlistData
      //   );
      //   console.log('플레이리스트 수정 응답:', response.data);
      // }
      // // 새로 추가하는 경우
      // else {
      //   const response = await axiosInstance.put(
      //     `/api/playlists/${album.id}`,
      //     playlistData
      //   );
      //   console.log('플레이리스트 추가 응답:', response.data);
      // }

      // 프론트엔드 상태 업데이트
      onAddPlaylist({
        musicId: music,
        startTime: null,
        endTime: null,
        latitude: latitude,
        longitude: longitude,
        locationAddress: placeName,
        photos: imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // 프론트엔드에서만 사용
        music: music,
        placeName: placeName,
        address: address,
      });

      setStep(4)
    } catch (error) {
      console.error("플레이리스트 생성/수정 중 오류 발생:", error);
      alert("플레이리스트 생성/수정 중 오류가 발생했습니다.");
    }
  };

  const isFormValid = music && placeName && address && imageUrls.length > 0;

  return (
    <div>
      <div>
        <label htmlFor="title">앨범 제목</label>
        <input
          type="text"
          id="title"
          value={currentTitle}
          onChange={handleTitleChange}
        />
      </div>

      <div>
        <label>사진 업로드</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUrls.length >= 5}
        >
          사진 입력
        </button>

        {/* 이미지 미리보기 */}
        <div style={{ display: "flex", gap: "10px" }}>
          {imageUrls.map((url, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={url}
                alt={`Selected ${index + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <button
                onClick={() => handleRemoveImage(url)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "gray",
                  color: "white",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div>
          <label>위치 검색</label>
          <SearchLocation
            onSelectPlace={handleSelectPlace}
            defaultKeyword={placeName}
          />
          {placeName && (
            <div>
              <p>선택된 장소: {placeName}</p>
              <button onClick={handleClearPlace}>장소 삭제</button>
            </div>
          )}
        </div>
      )}

      {placeName && (
        <div>
          <label>노래 선택</label>
          <SearchMusic onSelectMusic={setMusic} defaultKeyword={music} />
          {music && (
            <div>
              <p>선택된 노래: {music}</p>
            </div>
          )}
        </div>
      )}

      <button onClick={onCancel}>취소하기</button>

      <button onClick={handleSubmit} disabled={!isFormValid}>
        {editingPlaylist ? "수정하기" : "추가하기"}
      </button>
    </div>
  );
}

export default Step3;
