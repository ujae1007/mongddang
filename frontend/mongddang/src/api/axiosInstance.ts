//Axios 기본 설정 (Base URL 및 interceptors)
import axios from "axios";

//환경변수에서 API 기본 URL 가져오기
const BASE_URL = import.meta.env.VITE_API_URL ; 

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }})

// 요청 인터셉터 (ex: 토큰 추가)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 (에러 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 에러 발생:", error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;