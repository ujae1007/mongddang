import { useNavigate } from "react-router-dom"

function ErrorPage () {

  const nav = useNavigate()
  
  // 메인으로 가는 페이지
  const goToMain = () => {
    nav('/mainpage')
  }
  
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>죄송합니다. 페이지를 찾을 수 없습니다.</p>
      <p>존재하지 않는 주소를 입력하셨거나, <br />요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
      <img src="../../public/assets/404에러.png" alt="" width="188px" />
      <img src="../../public/assets/구름.png" alt="" width="50px" />
      <p onClick={goToMain} >메인으로 가기 &#8594; </p>
    </div>
  )
}

export default ErrorPage