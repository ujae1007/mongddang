// api 따로 관리하기 
// 서버주소 변경하고, VITE_API_URL 환경변수 만들어서 import 해오기 
// input components 만들기

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"

function Login () {

  const nav = useNavigate()

  //사용자 입력에 따른 상태관리
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  //이메일, 비밀번호, 로그인버튼튼 유효성 검사 
  const [emailValid, setEmailValid] = useState<boolean>(false)
  const [passwordValid, setPasswordValid] = useState<boolean>(false) 
  const [notAllow, setNotAllow] = useState<boolean>(true)

  //에러메세지 
  const [errorMessage, setErrorMessage] =useState<string>("")

  //이메일 & 비밀번호 핸들러
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(e.target.value)
    const regex = 
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
      // console.log(e.target)
    setEmailValid(regex.test(e.target.value))
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    const regex = 
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    setPasswordValid(regex.test(e.target.value))

  }

  //로그인 API 요청
    const onClickConfirmButton = async () => {
      setErrorMessage("") //기존 오류 메시지 초기화
      try {
        const res = await axios.post("http://localhost:8080/api/auth/signup",{
          email: email,
          password: password,
      })

      console.log(res.data, "로그인 성공")
      alert("로그인에 성공했습니다.")
      nav("/", {replace:true})
      }catch(err) {
        console.log(err, "로그인실패")
        setErrorMessage("에메일 또는 비밀번호가 잘못되었습니다.")
      }
    }
      
      
  useEffect(() => {
    setNotAllow(!(emailValid && passwordValid))
  }, [emailValid, passwordValid])

  return (

    <div className="Login">

      <div className="TitleWrap">LogIn</div>

      <div className="contentwrap">

        <div className="inputTitle">이메일 주소</div>
        <div className="inputWrap">
          <input 
            type="text"
            value={email} 
            className="input" 
            placeholder="이메일을 입력해주세요."
            onChange={handleEmail}            
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
          <input 
            value={password} 
            className="input" 
            type="password" 
            placeholder="비밀번호를 입력해주세요."
            onChange={handlePassword}
          />
        </div>
        <div className="errorMessageWrap">
          {
            !passwordValid && password.length > 0 && (
              <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
            )
          }
        </div>

      </div>

      {/* 에러메세지 */}
      {errorMessage && <p>{errorMessage}</p>}

      <div>
          <Button 
            text="로그인" 
            type="button"
            onClick={()=> {onClickConfirmButton()}}
            disabled={notAllow} 
          />
      </div>
    </div>
  ) 
}

export default Login