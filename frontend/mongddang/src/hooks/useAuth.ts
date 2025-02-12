//로그인한 유저 정보 API 요청 후 전역 상태 업데이트
import axiosInstance from "../api/axiosInstance"
import { useRecoilState, useRecoilValue } from "recoil"
import { authTokenAtom, userAtom } from "../recoil/userAtom"
import { useEffect } from "react"


const useAuth = () => {
  const [user, setUser] = useRecoilState(userAtom)
  const token = useRecoilValue(authTokenAtom)

  useEffect(() => {
    const fetchUSer = async () => {

      if (!token) {
        setUser(null)
        return
      }
      try {
        const res = await axiosInstance.get("/auth/current")
        setUser(res.data)
        console.log("로그인한 유저 닉네임: ", res.data.nickname)
      } catch (err) {
        console.log("유저 정보 가져오기 실패", err)
        setUser(null)
      }
    }
    fetchUSer()
  }, [setUser, token, authTokenAtom])

  return user
}

export default useAuth