import { useEffect, useState } from "react"

//더미데이터
const User = {
  email: "B209@ssafy.com",
  password: "1234qwer!@"
}

function Login () {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false) 
  const [notAllow, setNotAllow] = useState(true)

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(e.target.value)
    const regex = 
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if(regex.test(e.target.value)) {
      setEmailValid(true)
    }else {
      setEmailValid(false)
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    const regex = 
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if(regex.test(e.target.value)) {
      setPasswordValid(true)
    }else {
      setPasswordValid(false)
    }

  }

  const onClickConfirmButton = () => {
    if(email === User.email &&  password === User.password) {
      alert('로그인에 성공했습니다.')
    } else {
      alert('등록되지 않은 회원입니다.')
    }
  }

  useEffect(()=> {
    if(emailValid && passwordValid) {
      setNotAllow(false)
      return
    }
    setNotAllow(true)
  }, [emailValid, passwordValid ])

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

      <div>
        <button 
          onClick={onClickConfirmButton}
          disabled={notAllow} 
          className="bottomButton">로그인</button>
      </div>
    </div>
  ) 
}

export default Login