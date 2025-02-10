import { atom } from 'recoil';
import { Album } from '../types';

const getSavedAlbums = () => {
  const savedAlbums = localStorage.getItem('albumList');
  return savedAlbums ? JSON.parse(savedAlbums) : [];
};


// 생성된 전체 앨범 목록을 관리
export const albumListState = atom<Album[]>({
  key: 'albumListState',
  default: getSavedAlbums(),
  effects: [
    ({onSet}) => {
      onSet((newAlbums) => {
        localStorage.setItem('albumList', JSON.stringify(newAlbums));
      });
    }
  ]
});

// 현재 편집 중인 앨범 정보를 관리
export const currentAlbumState = atom<Album | null>({
  key: 'currentAlbumState',
  default: null
});

// 현재 진행 중인 스텝을 관리
export const albumStepState = atom<number>({
  key: 'albumStepState',
  default: 1
});