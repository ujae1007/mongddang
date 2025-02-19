import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { authTokenAtom } from "../../recoil/userAtom"
import { useRecoilValue } from "recoil"
import LikesAlbumList from "./LikesAlbumList"
import { useRef, useEffect } from "react"



function LikeAlbumsPage () {

  const nav = useNavigate()
  const authToken = useRecoilValue(authTokenAtom)

  useEffect(() => { 
    if (!authToken) {
      alert("로그인 후 이용하세요.");
      nav("/login");
    } 
  }, [authToken, nav]);

  
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
    <div style={{width:"100%"}}>
      <p style={{marginBottom:10, marginTop:20, color:"#111", fontSize:16}}><span style={{marginLeft:16,fontSize:30, color:"#111"}}>{loggedInUserNickname}</span>님이</p>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <p style={{margin:0, marginLeft:16, color:"#111", fontSize:16, marginBottom:10}}>좋아요한 앨범 목록</p>
        <button style={{marginRight:10,backgroundColor:"rgb(249, 249, 249)", border:"none", fontSize:16, color:"#66656c"}} onClick={handleScrollToThirdSection}>더보기 +</button>
      </div>

      <div>
        <LikesAlbumList thirdSectionRef={thirdSectionRef} loggedInuser={loggedInUserNickname}/>
      </div>
    </div>
  )
}

export default LikeAlbumsPage