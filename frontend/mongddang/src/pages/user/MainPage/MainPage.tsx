import useAuth from "../../../hooks/useAuth"
import RamdomSection from "./Ramdom"
import Map from "./Map"
import MyPlayListSection from "./MyPlayList"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authTokenAtom } from "../../../recoil/userAtom"
import { useEffect } from "react"

function MainPage () {

  const authToken = useRecoilValue(authTokenAtom)
  const nav = useNavigate()

  //로그인 되어 있지 않은 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!authToken) {
      alert("로그인 후 이용하세요.")
      nav('/login')
    }
  }, [authToken, nav])

  const loggedInUser = useAuth()
  const loggedInUsernickname = loggedInUser?.nickname

  return (
    <div style={{width:"100%"}}>
      {/* 첫번째 랜덤 앨범 */}
      <div style={{marginBottom:"30px"}}>
        <RamdomSection loggedInUser={String(loggedInUsernickname)} />
      </div>

      {/* 지도 */}
      <div style={{marginBottom:"30px"}}>
        <Map />
      </div>

      {/* 내 플레이리스트 일단 3개만 보이도록 하자*/}
      <div style={{padding:10}}>
        <MyPlayListSection loggedInUser={String(loggedInUsernickname)}/>
      </div>


    </div>
  )
}

export default MainPage