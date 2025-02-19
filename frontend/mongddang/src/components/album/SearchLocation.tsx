import { useState, useEffect } from "react";

import './SearchLocation.css';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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
  };

  const handleSelectPlace = (place: Place) => {
    onSelectPlace({
      placeName: place.place_name,
      address: place.address_name,
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    });
    setSelectedPlace(place);
    setKeyword(`${place.place_name}`); // input에 선택된 장소 표시 
    setPlaces([]); // 선택 후 검색 결과 초기화
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedPlace(null);
    setKeyword("");
  }



  return (
    <div>
      <div>
        <button onClick={handleOpenModal} className='LocationSearchBtn'>
          <div className="LocationSearchText">
            <img src="/assets/지도마커3.svg" alt="" style={{width:"12px"}}/>
            <div> 위치 추가 </div>
          </div>
          <img src="/assets/화살표.svg" alt="" />
        </button>
      </div>

      {isModalOpen && (
        <div className="LocationModal">
          {/* 창닫기 버튼 */}
          <div className="LocationModalContent">
            <div className='LocationSearchCloseBtn'>
              <img src="/assets/창닫기.svg" alt="" onClick={() => setIsModalOpen(false)} />
            </div>
          {/* 검색 폼 부분*/}
          <form onSubmit={handleSubmit} >
            <div className="LocationSearchForm">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="장소명을 입력하세요"
                className="LocationSearchInput"
              />

              <img 
                src="/assets/검색2.svg" 
                alt="" 
                onClick={()=>searchPlaces()}
                className="LocationSearchIcon"
              />
            </div>
          </form>

          {/* 검색 결과 리스트*/}
          {places.length > 0 && (
            <ul className="LocationSearchList">
              {places.map((place) => (
                <div className="LocationSearchItemResult">
                  <img src="/assets/지도마커.svg" alt="" />
                  <div
                    key={place.address_name}
                    onClick={() => handleSelectPlace(place)}>
                    <div className="LocationSearchResultPlace"> {place.place_name} </div>
                    <div className="LocationSearchResultAdress"> {place.address_name} </div>
                  </div>
                </div>
              ))}
            </ul>
          )}
          </div>


        </div>
      )}
    </div>

  )
}
export default SearchLocation;
