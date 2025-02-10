import { useRecoilValue } from "recoil"
import { userAtom } from "../../recoil/userAtom"

function MainPage () {

  const loggedInUser = useRecoilValue(userAtom)
  const loggedInUsernickname = loggedInUser?.nickname


  return (
    <div>{loggedInUsernickname}메인페이지</div>
  )
}

export default MainPage