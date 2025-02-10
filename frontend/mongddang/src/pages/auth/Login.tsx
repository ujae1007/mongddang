import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import InputBox from "../../components/common/input"
import axiosInstance from "../../api/axiosInstance"
import { useSetRecoilState } from "recoil"
import { tokenAtom } from "../../recoil/userAtom"

function Login () {

  const nav = useNavigate()

  //사용자 입력에 따른 상태관리
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  //이메일, 로그인버튼 유효성 검사 
  const [emailValid, setEmailValid] = useState<boolean>(false)

  //에러메세지 
  const [errorMessage, setErrorMessage] =useState<string>("")

  //이메일 핸들러
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(e.target.value)
    // console.log(e.target.value)
    const regex = 
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    setEmailValid(regex.test(e.target.value))
  }

  //비밀번호 핸들러
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setPassword(e.target.value) 
  }


//로그인 axios 요청
const handleLogin = async () => {
  
  const setToken = useSetRecoilState(tokenAtom)

  setErrorMessage("") //기존 오류 메시지 초기화
  console.log("로그인 버튼 클릭")
  try {
    const res = await axiosInstance.post("/auth/login",{
      email: email,
      password: password,
  },{
    // 만약 쿠키를 다루는 경우에는 아래와 같이 자격 증명을 포함시켜야 합니다.
    withCredentials: true, // 수정: 쿠키 포함 옵션 (필요한 경우)
  })
  const authorizationHeader = res.headers.authorization;
  console.log("Authorization Header:", authorizationHeader);

  //토큰을 recoil에 저장
  setToken(authorizationHeader)
  console.log(res.data, "로그인 성공")
  alert("로그인에 성공했습니다.")
  nav("/mainpage", {replace:true})
  }catch(err) {
    console.log(err, "로그인실패")
    setErrorMessage("이메일 또는 비밀번호가 잘못되었습니다.")
  }
}
      
    
  //이미 계정이 있을 경우
  const goToSignUp = () => {
    nav("/signup", { replace: true });
  };

  return (

    <div className="Login">

      <div className="TitleWrap">LogIn</div>

      <div className="contentwrap">

        <div className="inputTitle">이메일 주소</div>
        <div className="inputWrap">
          <InputBox 
            type="default"
            mode="login"
            placeholder="이메일을 입력해주세요."
            onChange={handleEmail}
            value={email}
            />
        </div>
        <div className="errorMessageWrap">
          {
            !emailValid && email.length > 0 && (
              <div>올바른 이메일을 입력해주세요.</div>
            )
          }
        </div>

        <div className="inputTitle">비밀번호</div>
        <div className="inputWrap">
          <InputBox 
            type="password"
            mode="login"
            placeholder="비밀번호를 입력해주세요."
            onChange={handlePassword}
            value={password}
          />
        </div>

      </div>

      {/* 에러메세지 */}
      {errorMessage && <p>{errorMessage}</p>}

      <div>
          <Button 
            text="로그인" 
            type="Large"
            onClick={handleLogin}
            disabled={!emailValid || !password} 
          />
          <p onClick={goToSignUp}>계정이 없으신가요? 회원가입</p>
      </div>
    </div>
  ) 
}

export default Login