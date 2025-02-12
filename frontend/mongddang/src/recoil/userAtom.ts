// 로그인한 유저 타입 정보 저장
import {atom} from "recoil"

export const authTokenAtom = atom<string | null>({
  key: 'authTokenAtom',
  default: (() => {
    // 초기 값으로 로컬 스토리지에 저장된 토큰을 사용
    const token = localStorage.getItem("auth_token");
    return token || null;
    })(),
  // effects를 사용해서 전역 변수 globalToken에 값을 저장
  // 값이 변경될 때마다 실행
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue) {
        // 새로운 토큰 값이 설정될 경우 로컬 스토리지에 저장
        localStorage.setItem("auth_token", newValue as string);
      } else {
        // 토큰이 null일 경우 로컬 스토리지에서 제거
        localStorage.removeItem("auth_token");
      }
    });
    },
  ]
});

// 유저 
export interface User {
  userId: number;
  email: string;
  password: string;
  nickname: string;
  likeRegion1: string;
  likeRegion2: string;
  likeRegion3: string;
  likeGenre1: string;
  likeGenre2: string;
  likeGenre3: string;
  profileImageURL: string;
  introduce: string;
}

export const userAtom = atom<User | null>({
  key: "userAtom", 
  default: null,
})

