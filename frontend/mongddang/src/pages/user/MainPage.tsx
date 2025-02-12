import useAuth from "../../hooks/useAuth"

function MainPage () {

  const loggedInUser = useAuth()
  const loggedInUsernickname = loggedInUser?.nickname



  return (
    <div>
      {loggedInUsernickname}님의 메인페이지
    </div>
  )
}

export default MainPage