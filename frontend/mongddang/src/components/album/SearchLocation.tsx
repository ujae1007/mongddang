import { useState } from "react";

interface Place {
  place_name: string;
  address_name: string;
  y: string; // 위도
  x: string; // 경도
}

interface SearchLocationProps {
  onSelectPlace: (place: {
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  defaultKeyword?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

function SearchLocation({
  onSelectPlace,
  defaultKeyword = "",
}: SearchLocationProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchPlaces = async () => {
    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    setIsSearching(true);

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: Place[], status: any) => {
      setIsSearching(false);

      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        setPlaces([]);
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert("검색 중 오류가 발생했습니다.");
        setPlaces([]);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlaces();
  };

  const handleSelectPlace = (place: Place) => {
    onSelectPlace({
      placeName: place.place_name,
      address: place.address_name,
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    });
    setPlaces([]); // 선택 후 검색 결과 초기화
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="장소를 검색하세요"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? "검색 중..." : "검색"}
        </button>
      </form>

      {places.length > 0 && (
        <ul>
          {places.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelectPlace(place)}
              style={{ cursor: "pointer" }}
            >
              <p>{place.place_name}</p>
              <small>{place.address_name}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchLocation;
