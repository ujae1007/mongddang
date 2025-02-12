//Axios 기본 설정 (Base URL 및 interceptors)
import axios from "axios";
import { getRecoil, setRecoil } from "recoil-nexus";
import { authTokenAtom } from "../recoil/userAtom";

//환경변수에서 API 기본 URL 가져오기
const BASE_URL = import.meta.env.VITE_API_URL ; 

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 쿠키 포함
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }})

// 요청 인터셉터에서 토큰을 설정해서 서버로 보내기
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getRecoil(authTokenAtom);
    if (token) {
      // Authorization 헤더 설정
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터에서 토큰을 저장하기
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config; // 오류가 발생한 요청

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true; // 재시도 플래그

      try {
        // 토큰 재발급 요청
        const res = await axios.post (
          // 재발급 요청 API는 순수 axios로 요청해서 무한 루프를 방지 
          // axiosInstance로 요청하면 인터셉터가 다시 실행되어 무한 루프에 빠지게 된다.
          `${BASE_URL}/auth/reissue`, 
          {}, 
          { withCredentials: true }
        );
        const newToken = res.headers.authorization; // 새 토큰

        if (newToken) {
          // recoil 상태 업데이트
          setRecoil(authTokenAtom, newToken);

          // 원래 요청 헤더에 새 토큰 설정
          originalRequest.headers.Authorization = newToken;
          
          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        // 토큰 재발급 실패 시 로그인 페이지로
        console.log('토큰 재발급 실패',err);
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;