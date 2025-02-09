// 로그인한 유저 타입 정보 저장
import {atom} from "recoil"

// 유저 
export interface User {
  user_id: number;
  email: string;
  nickname: string;
  like_rigion1: string;
  like_rigion2: string;
  like_rigion3: string;
  like_genre1: string;
  like_genre2: string;
  like_genre3: string;
  profile_image_URL: string;
  introduce: string;
}

export const userAtom = atom<User | null>({
  key: "userAtom", 
  default: null,
})