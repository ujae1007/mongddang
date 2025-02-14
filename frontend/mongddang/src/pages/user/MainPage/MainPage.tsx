import useAuth from "../../../hooks/useAuth"
import RamdomSection from "./Ramdom"
import MapSection from "./Map"
import MyPlayListSection from "./MyPlayList"

function MainPage () {

  const loggedInUser = useAuth()
  const loggedInUsernickname = loggedInUser?.nickname

  return (
    <div>
      <p>반갑습니다.{loggedInUsernickname}님!</p>
      
      {/* 첫번째 랜덤 앨범 */}
      <div>
        <RamdomSection />
      </div>

      {/* 지도 */}
      <div>
        <MapSection />
      </div>

      {/* 내 플레이리스트 일단 3개만 보이도록 하자*/}
      <div>
        <MyPlayListSection />
      </div>

      {/* 추천 플레이리스트 */}

    </div>
  )
}

export default MainPage