import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Playlist } from '../../types';

interface MapBoxProps {
  playlists: Playlist[];
}

// function MapBox({ playlists }: MapBoxProps) {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

//   const isFirstLoad = useRef(true);
//   const initialBounds = useRef<mapboxgl.LngLatBounds | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<string | null>(
//     playlists[0]?.locationAddress || null
//   );

//   useEffect(() => {
//     if (!mapContainer.current || map.current) return;

//     mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

//     if (isFirstLoad.current && !initialBounds.current) {
//       initialBounds.current = new mapboxgl.LngLatBounds();
//       playlists.forEach((playlist) => {
//         initialBounds.current!.extend([playlist.longitude as number, playlist.latitude as number]);
//       });
//     }

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: import.meta.env.VITE_MAPBOX_STYLE,
//     });

//     map.current.on('load', () => {
//       if (isFirstLoad.current && initialBounds.current) {
//         map.current!.fitBounds(initialBounds.current, { padding: 50, maxZoom: 11 });
//         isFirstLoad.current = false;
//       }

//       playlists.forEach((playlist) => {
//         addMarker(playlist);
//       });
//     });

//     return () => {
//       Object.values(markers.current).forEach((marker) => marker.remove());
//       markers.current = {};
//       map.current?.remove();
//     };
//   }, [playlists]);

//   useEffect(() => {
//     // 기존 마커 제거 후 다시 추가 (색상 변경 반영)
//     Object.values(markers.current).forEach((marker) => marker.remove());
//     markers.current = {};

//     playlists.forEach((playlist) => {
//       addMarker(playlist);
//     });
//   }, [selectedLocation]);

//   const addMarker = (playlist: Playlist) => {
//     const isSelected = selectedLocation === playlist.locationAddress;

//     const marker = new mapboxgl.Marker({
//       color: isSelected ? '#9747FF' : '#9999A1',
//     })
//       .setLngLat([playlist.longitude as number, playlist.latitude as number])
//       .addTo(map.current!);

//     const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
//       `<h3>${playlist.placeName}</h3><p>${playlist.music}</p>`
//     );

//     marker.getElement().addEventListener('click', () => {
//       // 기존에 열린 팝업 닫기
//       Object.values(markers.current).forEach((m) => m.getPopup()?.remove());

//       // 클릭한 마커 즉시 팝업 띄우기
//       popup.addTo(map.current!);

//       // 상태 업데이트
//       setSelectedLocation(playlist.locationAddress);
//     });

//     marker.setPopup(popup);
//     markers.current[playlist.locationAddress as string] = marker;

//     // 선택된 마커인 경우 팝업 표시
//     if (isSelected) {
//       popup.addTo(map.current!);
//     }
//   };

//   useEffect(() => {
//     if (selectedLocation) {
//       const selectedMarker = markers.current[selectedLocation];
//       if (selectedMarker) {
//         // 팝업 띄우기
//         selectedMarker.getPopup()?.addTo(map.current!);
//       }
//     }
//   }, [selectedLocation]);

//   return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
// }

function MapBox({ playlists }: MapBoxProps) {
  // MapBox 지도 자체를 렌더링하기위한 컨테이너
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // MapBox 인스턴스를 저장할 ref
  const map = useRef<mapboxgl.Map | null>(null);

  // 마커 정보를 저장할 state
  interface MarkerInfo {
    locationAddress: string;
    musicDetails: {
      title: string;
      artist: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }

  // 마커들 저장 (플레이리스트별로 마커를 구분하기 위해 객체로 저장)
  const [markerInfos, setMarkerInfos] = useState<MarkerInfo[]>([]);

  // playlists 데이터 처리
  useEffect(() => {
    // playlists의 정보를 markerInfos로 변환
    const newMarkerInfos = playlists.map(playlist => ({
      locationAddress: playlist.locationAddress,
      musicDetails: playlist.musicDetails,
      coordinates: {
        latitude: playlist.latitude,
        longitude: playlist.longitude
      }
    }));

    setMarkerInfos(newMarkerInfos);
    console.log('Marker infos:', newMarkerInfos);
  }, [playlists]);



  useEffect(() => {
    // 지도를 표시할 div가 없으면 실행하지 않음
    if (!mapContainer.current) return;

    // .env 파일에서 MapBox 액세스 토큰 불러오기
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    // 설정한 옵션들로 새로운 지도 생성
    // new mapboxgl.Map() : 지도 그리기 시작
    map.current = new mapboxgl.Map({
      container: mapContainer.current,  // 실제 지도가 그려지는 영역
      style: import.meta.env.VITE_MAPBOX_STYLE,  // 지도 스타일
      center: [126.9780, 37.5665],     // 지도가 처음 표시되는 중심점 [경도, 위도] 
      zoom: 10                         // 초기 줌 레벨 (0-22)
                                        // 0 : 지도 전체 보기
                                        // 10 : 도시 정도 크기
                                        // 15 : 거리 수준
                                        // 12 : 최대 확대 
    });
  }, []); // 컴포넌트가 처음 마운트될 때만 실행

    return (
      <div>
        <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
      </div>
    );
  
  }
      

export default MapBox;