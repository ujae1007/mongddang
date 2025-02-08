// 공통으로 사용되는 타입 저장하고 활용

// 플레이리스트
export interface Playlist {
  id: number;
  music: string;
  latitude: number;
  longitude: number;
  placeName: string;
  address: string;
  imageUrl: string;
}

// 앨범
export interface Album {
  id: number;
  title: string;
  album_image_URL: string;
  status: boolean;
  playlists: Playlist[];
}

