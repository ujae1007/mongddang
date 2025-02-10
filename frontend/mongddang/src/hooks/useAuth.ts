//로그인한 유저 정보 API 요청 후 전역 상태 업데이트
import axiosInstance from "../api/axiosInstance"
import { useRecoilState } from "recoil"
import { userAtom } from "../recoil/userAtom"
import { useEffect } from "react"


const useAuth = () => {
  const [user, setUser] = useRecoilState(userAtom)

  useEffect(() => {
    const fetchUSer = async () => {
      try {
        const res = await axiosInstance.get("/auth/current")
        setUser(res.data)
      } catch (err) {
        console.log("유저 정보 가져오기 실패", err)
        setUser(null)
      }
    }
    fetchUSer()
  }, [setUser])

  return user
}

export default useAuth