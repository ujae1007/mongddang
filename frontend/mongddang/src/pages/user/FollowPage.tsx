import { useNavigate } from "react-router-dom"
import { useState } from "react"
import useAuth from "../../hooks/useAuth"
import FollowList from "./FollowList"
import { useLocation } from "react-router-dom"

function FollowPage () {
  
  // 나의 아이디 값 가져오기 
  const loggedInUser = useAuth()
  const userId = loggedInUser?.userId // 타입: number
  const nav = useNavigate()
  const location = useLocation()


  // 팔로워 팔로잉 버튼 선택 값 저장하기
  const [activeTab, setActiveTab] = useState<"followers" | "followings"> (location.state?.tab || "followers")


  // 뒤로가기 버튼 클릭시 다시 프로파일 페이지로 이동
  const goToProfile = () => {
    nav(`/profile/${userId}`, {replace: true})
  }

  // 유저가 없다면 이거 없으면 엑시오스 에러남 초반에 userId 값 가져오기까지 시간이 걸리니까 필요함  
  if (!userId) {
    return <div>Loading...</div>
  }


  return (
    <div>
      {userId}님의 팔로우페이지 <br /> 
      <button onClick={goToProfile} >&lt; 뒤로가기</button> <br />

      {/* 버튼 */}
      {/* 지피티가 짜준 스타일임 다 삭제해도됨 */}
      <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0", marginBottom: "10px" }}>

        <button 
          onClick={() => setActiveTab("followers")} 
          style={{
            flex: 1,
            padding: "10px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: activeTab === "followers" ? "3px solid #9333ea" : "none",
            color: activeTab === "followers" ? "#9333ea" : "#888",
            fontWeight: activeTab === "followers" ? "bold" : "normal",
            cursor: "pointer",
            background: "none",
          }}
        >
          Followers
        </button>

        <button 
          onClick={() => setActiveTab("followings")} 
          style={{
            flex: 1,
            padding: "10px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: activeTab === "followings" ? "3px solid #9333ea" : "none",
            color: activeTab === "followings" ? "#9333ea" : "#888",
            fontWeight: activeTab === "followings" ? "bold" : "normal",
            cursor: "pointer",
            background: "none",
          }}
        >
          Followings
        </button>

      </div>
      {/* 목록 리스트 */}
      <FollowList userId={String(userId)} type={activeTab} />
    </div>
  )
}

export default FollowPage