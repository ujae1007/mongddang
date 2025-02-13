import useAuth from "../../hooks/useAuth"
// import { useNavigate } from "react-router-dom"
import LikesAlbumList from "./LikesAlbumList"
import { useRef } from "react"

function LikeAlbumsPage () {
  
  const loggedInuser = useAuth() // 객체를 반환 
  const loggedInUserNickname = loggedInuser?.nickname 
  const thirdSectionRef = useRef<HTMLDivElement>(null)

  // 로딩페이지
  if (!loggedInUserNickname) {
    return <div>Loading...</div>
  }
  
  // 더보기 누르면 세번째 섹션으로 이동
  const handleScrollToThirdSection = () => {
    thirdSectionRef.current?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
    })
  }

  return (
    <div>
      <p>{loggedInUserNickname}님이 좋아요한 앨범 목록</p>
      <button onClick={handleScrollToThirdSection}>더보기</button>

      <div>
        <LikesAlbumList thirdSectionRef={thirdSectionRef} loggedInuser={loggedInUserNickname}/>
      </div>
    </div>
  )
}

export default LikeAlbumsPage