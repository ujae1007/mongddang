import "./AppBar.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"

const AppBar = () => {
  const navigate = useNavigate()

  // 현재 로그인한 사용자 정보 가져오기
  const loggedInUser = useAuth()
  const [loggedInUserId, setLoggedInUserId] = useState<number>()
  const [loggedInUserProfile, setLoggedInUserProfile] = useState<string>()

  useEffect(() => {
    if(loggedInUser) {
      setLoggedInUserId(loggedInUser.userId) // 로그인한 유저 아이디
      setLoggedInUserProfile(loggedInUser.profileImageURL) //  로그인한 유저 프로필 이미지 
    }
  }, [loggedInUser])

  return (
    <div className="appbar">
      <img src="/assets/logo.png" alt="logo" className="logoimg"/>
      <div onClick={() => navigate(`/profile/${loggedInUserId}`)} style={{display: "flex", alignItems: "center"}}>
        <img src={loggedInUserProfile} alt="profile" className="profileimg"/>
      </div>
    </div>
  )
}

export default AppBar