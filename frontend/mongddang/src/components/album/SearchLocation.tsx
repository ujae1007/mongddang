import { useState, useEffect } from "react";

interface Place {
  place_name: string; // 장소명
  address_name: string; // 주소
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
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false); // 카카오맵 로드 여부 확인
  const [showResults, setShowResults] = useState(false); // 팝업 표시 상태

  const VITE_KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY ; 

  useEffect(() => {
    // Kakao Maps SDK 스크립트 로드
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${VITE_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsKakaoMapLoaded(true);
      });
    };

    document.head.appendChild(script); // 스크립트 로드

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  const searchPlaces = async () => {
    if (!keyword.trim()) {
      alert("장소명을 입력해주세요");
      return;
    }

    if (!isKakaoMapLoaded) {
      alert("아직 지도가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
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
    setShowResults(true); // 검색 버튼 클릭 시 검색 결과 팝업 표시
  };

  const handleSelectPlace = (place: Place) => {
    onSelectPlace({
      placeName: place.place_name,
      address: place.address_name,
      latitude: place.y,
      longitude: place.x,
    });
    setPlaces([]); // 선택 후 검색 결과 초기화
    setShowResults(false); // 선택 후 팝업 닫기 
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

      {/* 모달 오버레이 */}
      {/* 오버레이 형태로 보이게 하기 위해 일단 임시로 적용된 스타일 */}
      {showResults && places.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>

          {/* 모달 컨텐츠 */}
          <div style={{
            width: '80%',
            maxHeight: '70%',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0 }}>검색 결과</h3>
              <button 
                onClick={() => setShowResults(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              margin: 0
            }}>
              {places.map((place, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectPlace(place)}
                  style={{
                    padding: '15px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer'
                  }}
                >
                  <p style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '16px'
                  }}>
                    {place.place_name}
                  </p>
                  <small style={{ color: '#666' }}>
                    {place.address_name}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchLocation;
