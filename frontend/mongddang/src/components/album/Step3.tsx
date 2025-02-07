import { useState, useRef, useEffect } from "react";
import { Playlist } from "../../types";
import SearchLocation from "./SearchLocation";
import SearchMusic from "./SearchMusic";

interface Step3Props {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onAddPlaylist: (playlistData: Omit<Playlist, "id">) => void;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    editingPlaylist?.imageUrl || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = () => {
    const playlistData = {
      music,
      latitude,
      longitude,
      placeName,
      address,
      imageUrl: imagePreview,
    };

    onAddPlaylist(playlistData);
  };

  const isFormValid = music && placeName && address && imagePreview;

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
        <label>사진 입력</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
        <button onClick={() => fileInputRef.current?.click()}>사진 입력</button>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        )}
      </div>

      {imagePreview && (
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
          <SearchMusic
            onSelectMusic={setMusic}
            defaultKeyword={music}
          />
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