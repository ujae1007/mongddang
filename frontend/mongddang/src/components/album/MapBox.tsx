import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Playlist } from '../../types';

interface MapBoxProps {
  playlists: Playlist[];
}

function MapBox({ playlists }: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const isFirstLoad = useRef(true);
  const initialBounds = useRef<mapboxgl.LngLatBounds | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    playlists[0]?.locationAddress || null
  );

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    if (isFirstLoad.current && !initialBounds.current) {
      initialBounds.current = new mapboxgl.LngLatBounds();
      playlists.forEach((playlist) => {
        initialBounds.current!.extend([playlist.longitude as number, playlist.latitude as number]);
      });
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: import.meta.env.VITE_MAPBOX_STYLE,
    });

    map.current.on('load', () => {
      if (isFirstLoad.current && initialBounds.current) {
        map.current!.fitBounds(initialBounds.current, { padding: 50, maxZoom: 11 });
        isFirstLoad.current = false;
      }

      playlists.forEach((playlist) => {
        addMarker(playlist);
      });
    });

    return () => {
      Object.values(markers.current).forEach((marker) => marker.remove());
      markers.current = {};
      map.current?.remove();
    };
  }, [playlists]);

  useEffect(() => {
    // 기존 마커 제거 후 다시 추가 (색상 변경 반영)
    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    playlists.forEach((playlist) => {
      addMarker(playlist);
    });
  }, [selectedLocation]);

  const addMarker = (playlist: Playlist) => {
    const isSelected = selectedLocation === playlist.locationAddress;

    const marker = new mapboxgl.Marker({
      color: isSelected ? '#9747FF' : '#9999A1',
    })
      .setLngLat([playlist.longitude as number, playlist.latitude as number])
      .addTo(map.current!);

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${playlist.placeName}</h3><p>${playlist.music}</p>`
    );

    marker.getElement().addEventListener('click', () => {
      // 기존에 열린 팝업 닫기
      Object.values(markers.current).forEach((m) => m.getPopup()?.remove());

      // 클릭한 마커 즉시 팝업 띄우기
      popup.addTo(map.current!);

      // 상태 업데이트
      setSelectedLocation(playlist.locationAddress);
    });

    marker.setPopup(popup);
    markers.current[playlist.locationAddress as string] = marker;

    // 선택된 마커인 경우 팝업 표시
    if (isSelected) {
      popup.addTo(map.current!);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      const selectedMarker = markers.current[selectedLocation];
      if (selectedMarker) {
        // 팝업 띄우기
        selectedMarker.getPopup()?.addTo(map.current!);
      }
    }
  }, [selectedLocation]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
}

export default MapBox;