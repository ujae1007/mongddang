import { useState, useRef, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { albumStepState } from "../../recoil/albumState";
import { Playlist } from "../../types";
import SearchLocation from "./SearchLocation";
import SearchMusic from "./SearchMusic";
import axiosInstance from "../../api/axiosInstance";

import Button from "../common/Button";
import TitleInput from "./TitleInput";

import './Step3.css'

interface Step3Props {
  albumId: number;
  playlistId: number;
  title: string;
  onUpdateTitle: (title: string) => void;
  onAddPlaylist: (playlistData: Playlist) => void;
  onCancel: () => void;
  editingPlaylist?: Playlist;
}

function Step3({
  albumId,
  playlistId, 
  title,
  onUpdateTitle,
  onAddPlaylist,
  onCancel,
  editingPlaylist,
}: Step3Props) {
  const [music, setMusic] = useState(editingPlaylist?.music || "");
  const [placeName, setPlaceName] = useState(editingPlaylist?.placeName || "");
  const [address, setAddress] = useState(editingPlaylist?.address || "");
  const [latitude, setLatitude] = useState(editingPlaylist?.latitude || 0);
  const [longitude, setLongitude] = useState(editingPlaylist?.longitude || 0);
  const [imageUrls, setImageUrls] = useState<string[]>(editingPlaylist?.photos || []);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null); // 검색해서 선택한 노래 정보보
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setStep = useSetRecoilState(albumStepState);

  // 장소 정보가 변경될 때 노래 정보 초기화
  useEffect(() => {
    if (!placeName) {
      setMusic("");
    }
  }, [placeName]);

  const handleTitleChange = async (newTitle : string) => {
    setCurrentTitle(newTitle);
    
    try {
      await axiosInstance.put(`/albums/title/${albumId}`, {
        title: newTitle
      });
      onUpdateTitle(newTitle);
    } catch (error) {
      console.error("앨범 제목 수정 중 오류 발생:", error);
      alert("제목 수정 중 오류가 발생했습니다.");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (imageUrls.length < 5) {
          setImageUrls(prev => [...prev, imageUrl]);
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

  const handleSubmit = async () => {

    if (!isFormValid) return;
    setIsSaving(true);

    try {
      // Form Data 생성
      const formData = new FormData();
    
      // 이미지 파일들 추가
      const imageFiles = imageUrls.map((imageUrl, index) => {

        // 이미 서버에서 온 이미지 URL이면 그대로 반환
      if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
        return null;
      }

        // 이미지 처리
        const byteString = atob(imageUrl.split(',')[1]);
        const mimeType = imageUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeType });
        return new File([blob], `image${index}.${mimeType.split('/')[1]}`, { type: mimeType });
      }).filter(file => file !== null); // null 제거

        imageFiles.forEach(file => {
          formData.append('files', file);
        });

      // 다른 데이터들 추가
      formData.append('musicId', String(music)); // 일단 임시로 DB에 넣어둔 1로 설정
      formData.append('startTime', 0); 
      formData.append('endTime', 0); 
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('locationAddress', placeName);

      // 플레이리스트 ID 결정
      const targetPlaylistId = editingPlaylist?.playlistId || playlistId;
            
      // API 호출
      const response = await axiosInstance.put(
        `/playlists/${targetPlaylistId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
  
      );
      console.log("플레이리스트 생성/수정 완료:", response.data);

      // imageUrls에 기존 서버 이미지 URL 포함
      const finalImageUrls = imageUrls.map(url => 
        url.startsWith('http') || url.startsWith('/') ? url : url
      );

      // 프론트엔드 상태 업데이트
      onAddPlaylist({
        playlistId: targetPlaylistId,
        musicId: selectedMusic?.musicId || music,
        startTime: null,
        endTime: null,
        latitude,
        longitude,
        locationAddress: placeName,
        photos: finalImageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // 프론트엔드에서만 사용
        music: selectedMusic ? `${selectedMusic.trackName} - ${selectedMusic.artistName}` : music,
        placeName: placeName,
        address: address,
      });
      setStep(4)
    } catch (error) {
      console.error("플레이리스트 생성/수정 중 오류 발생:", error);
      alert("플레이리스트 생성/수정 중 오류가 발생했습니다.");
    }
  };

  // 모든 내용을 다 입력하였는지 확인
  const isFormValid = music && placeName && address && imageUrls.length > 0;

  // 플레이리스트 수정 여부 확인 
  const hasChanges = 
      music !== editingPlaylist?.music || 
      placeName !== editingPlaylist?.placeName || 
      address !== editingPlaylist?.address || 
      imageUrls.length !== (editingPlaylist?.photos?.length || 0);

  return (
    <div className="StepThreePage">
      <div className="step3-container">
        <p style={{fontSize:"20px", padding:"10px 0px 10px 0px", color:"#66656C" }}>앨범 제목</p>
        <TitleInput
            title={currentTitle}
            onChange={handleTitleChange}
        />
      </div>

      <div className="addPlayListItem">
        {/* 사진 */}
        <div className="step3-image">
          <div className="addimage">
            <div style={{ display: "flex", flexDirection: "column" }}>
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
                style={{ backgroundColor: "white", border: "none", display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }} 
              >
                <img src="/assets/추가.svg" alt="" />

                <div > 사진 추가</div>
              </button>
            </div>
            {/* 이미지 미리보기 */}
            <div>

            <div style={{ display: "flex", gap: "5px", flex: 1, flexWrap: "wrap" }}>
              {imageUrls.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`Selected ${index + 1}`}
                    style={{ width: "120px", height: "120px", objectFit: "cover", marginLeft: "20px", gap: "10px" }}
                  />
                  <button
                    onClick={() => handleRemoveImage(url)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            </div>
          </div>

        </div>
        
        {/* 장소 */}
        <div className="step3-place">
          <div style={{}}>
            {imageUrls.length > 0 && (
              <div >
                <SearchLocation
                  onSelectPlace={handleSelectPlace}
                  defaultKeyword={placeName}
                />
                <div className="searchResult"> {placeName}</div>
              </div>
            )}
          </div>
        </div>
    
        {/* 노래 */}
        <div className="step3-music">
          {placeName && (
            <div>
              <SearchMusic 
                onSelectMusic={(music) => {
                  setMusic(music.musicId);
                  setSelectedMusic(music); // 선택한 음악 정보 저장
                }} 
                defaultKeyword={music} />
              {music && (
                <div>
                  <p className="searchResult">{selectedMusic.trackName} - {selectedMusic.artistName}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      <div className="step3-button">
        <Button
          type="Middium"
          text="취소하기"
          onClick={onCancel}
          />

        <Button
          type="Middium"
          text={isSaving ? "저장 중..." : (editingPlaylist ? "수정하기" : "추가하기")}
          using="Album2"
          onClick={handleSubmit}
          disabled={editingPlaylist ? !hasChanges : !isFormValid || isSaving}
          />
      </div>

    </div>
  );
}

export default Step3;