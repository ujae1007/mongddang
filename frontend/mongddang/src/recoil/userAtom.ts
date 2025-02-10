// 로그인한 유저 타입 정보 저장
import {atom} from "recoil"

// 유저 
export interface User {
  userId: number;
  email: string;
  password: string;
  nickname: string;
  likeRigion1: string;
  likeRigion2: string;
  likeRigion3: string;
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

export const tokenAtom = atom<string | null>({
  key:"tokenAtom",
  default: null,
})