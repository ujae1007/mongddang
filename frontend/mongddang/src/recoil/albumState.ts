import { atom } from 'recoil';
import { Album } from '../types';

// 현재 진행 중인 스텝을 관리
export const albumStepState = atom<number>({
  key: 'albumStepState',
  default: 1
});

// 현재 편집 중인 앨범 정보를 관리
export const currentAlbumState = atom<Album | null>({
  key: 'currentAlbumState',
  default: null
});