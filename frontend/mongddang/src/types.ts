// 플레이리스트
export interface Playlist {
  playlistId?: number;
  musicId: string | null;
  startTime: string | null;
  endTime: string | null;
  latitude: number | null;
  longitude: number | null;
  locationAddress: string | null; // placeName(장소명)을 저장
  photos: string[] | null;
  createdAt?: string;
  updatedAt?: string;

  // 프론트엔드 추가 필드
  music?: string;
  placeName?: string;
  address?: string;
}

// 앨범
export interface Album {
  albumId: number;
  userId?: number;
  title: string;
  albumImageUrl: string;
  status: boolean;
  playlists: Playlist[];
  createdAt?: string;
  updatedAt?: string;
}


// 팔로워, 팔로잉 정보
export interface GetfollowInfo {
  userId: number;
  nickname: string;
  profileImageURL:string 
  introduce: string;
}