import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxProps {
  playlists: Playlist[];
  onPlaylistSelect: (playlistId: number) => void; // 선택한 플레이리스트 정보를 전달
}

interface Playlist {
  playlistId: number;
  albumId: number;
  musicId: number;
  startTime: number | null;
  endTime: number | null;
  latitude: string;
  longitude: string;
  locationAddress: string;
  photoUrls: string[];
  musicDetails: {
    trackName: string;
    artistName: string;
  };
}

function MapBox({ playlists, onPlaylistSelect }: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null); // MapBox 지도 자체를 렌더링하기위한 컨테이너
  const map = useRef<mapboxgl.Map | null>(null);  // MapBox 인스턴스를 저장할 ref  
  const markers = useRef<mapboxgl.Marker[]>([]);  // 마커들을 저장할 ref
  const [markerInfos, setMarkerInfos] = useState<MarkerInfo[]>([]); // 마커들 저장할 state
  const [selectedLocation, setSelectedLocation] = useState<string>(
    // playlists가 있다면 첫 번째 플레이리스트의 위치를, 없다면 빈 문자열을 초기값으로 설정정
    playlists[0]?.locationAddress || ''); // 선택된 위치 저장할 state
  
  // 마커 정보를 저장할 state
  interface MarkerInfo {
    playlistId: number;
    locationAddress: string;
    musicDetails: {
      title: string;
      artist: string;
    };
    coordinates: {
      latitude: string;
      longitude: string;
    };
  }

  // playlists 데이터 처리
  useEffect(() => {
    // playlists의 정보를 markerInfos로 변환
    const newMarkerInfos = playlists.map(playlist => ({
      playlistId: playlist.playlistId,
      locationAddress: playlist.locationAddress,
      musicDetails: playlist.musicDetails,
      coordinates: {
        latitude: playlist.latitude,
        longitude: playlist.longitude
      }
    }));

    setMarkerInfos(newMarkerInfos);

    // 첫 번째 마커를 선택 상태로 설정
    if (newMarkerInfos.length > 0 && !selectedLocation) {
      setSelectedLocation(newMarkerInfos[0].locationAddress);
      onPlaylistSelect(playlists[0].playlistId);
    }
  }, [playlists, onPlaylistSelect]);

  // 지도 생성 및 마커 추가 
  useEffect(() => {
    if (!mapContainer.current || !markerInfos.length) return;

    // MapBox 초기화
    if(!map.current) {
      mapboxgl.accessToken =import.meta.env.VITE_MAPBOX_TOKEN

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: import.meta.env.VITE_MAPBOX_STYLE,
      });
    
      // 모든 마커를 포함하는 경계 생성
        const bounds = new mapboxgl.LngLatBounds();
        markerInfos.forEach(info => {
          bounds.extend([
            parseFloat(info.coordinates.longitude),
            parseFloat(info.coordinates.latitude)
          ]);
        });

        // 경계에 맞춰 지도 이동
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 10  // 너무 가까이 줌인되는 것 방지
        });


      // 지도가 로드된 후 마커 추가
      map.current.on('load', () => {
        addMarkers();
      });
    } else {
      addMarkers();
    }

    // 마커 추가 함수
    function addMarkers() {

      // 기존 마커 삭제
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // 새로운 마커 추가
      markerInfos.forEach(markerInfo => {
        const marker = new mapboxgl.Marker({          
          color: markerInfo.locationAddress === selectedLocation ? '#9747FF' : '#9999A1' // 선택 여부에 따라 색 다르게 지정정
        })
          .setLngLat([
            parseFloat(markerInfo.coordinates.longitude), 
            parseFloat(markerInfo.coordinates.latitude)
          ])
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3>${markerInfo.locationAddress}</h3>
            <p>${markerInfo.musicDetails.artistName} - ${markerInfo.musicDetails.trackName}</p>
          `);

         // 마커 클릭 이벤트 추가
          marker.getElement().addEventListener('click', () => {
            // 기존의 모든 팝업 제거
            markers.current.forEach(m => m.getPopup().remove());

            // 선택된 마커의 색상 변경
            setSelectedLocation(markerInfo.locationAddress);

            // 선택한 플레이리스트 정보 전달
            onPlaylistSelect(markerInfo.playlistId);

            
            // 팝업 표시
            popup.addTo(map.current!);

          });
          
          marker.setPopup(popup);
          markers.current.push(marker);
      });

      // 초기 선택된 마커의 팝업 표시
      if (selectedLocation) {
        const selectedMarker = markers.current.find(
          marker => {
            const lngLat = marker.getLngLat();
            return markerInfos.some(info => 
              info.coordinates.longitude === lngLat.lng && 
              info.coordinates.latitude === lngLat.lat &&
              info.locationAddress === selectedLocation
            );
          }
        );

      if (selectedMarker) {
        selectedMarker.getPopup().addTo(map.current!);
      }
    }

     // 네비게이션 컨트롤(확대/축소 버튼) 추가
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'  // 우측 상단에 위치
    );

    }

    // 컴포넌트 언마운트 시 지도 삭제
    return () => {
      markers.current.forEach(marker => marker.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
   }, [markerInfos, selectedLocation]);

   return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

export default MapBox;