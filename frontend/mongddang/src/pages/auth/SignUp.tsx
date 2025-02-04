//프로필 사진, 선호장르, 선호장소 받아야함
//버튼 컴포넌트로 만들기
// 유효성 검사(이메일형식, 비밀번호 일치확인, 버튼 활성화, 닉네임 체크)
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function SignUp () {


  const [nickName, setNickName] = useState("")
  const [email, setEmail] = useState("")
  const [certify, setCertify] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")

  const nav = useNavigate()

  const register = () => {
    //유효성 검사
    if(password !== secondPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    axios
    //주소 수정
    .post('http://localhost:1337/api/auth/local/register', {
      nickName: nickName,
      email:email,
      password: password,
    })
    // 위에있는게 끝나지 않으면 실행X
    .then((res) => {
      console.log('회원가입 성공')
      //여기 아래 어떤 내용인지 확인필요
      console.log(res.data.jwt)
      localStorage.setItem('jwt',res.data.jwt)
      //이름 확인, 경로 확인
      const userId = res.data.userId
      //메인페이지로 이동
      nav(`/home/${userId}`, {replace:true})
    })
    .catch((err) => {
      console.log('회원가입 실패', err)
    })
  }

  return (
    <div className="SignUp">

      <div className="TitleWrap">SignUp</div>

      <div className="contentWrap">

        <div className="inputWrap">
          <input
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
            }}
            type="text"
            className="input" 
            placeholder="닉네임을 입력해주세요."
          />
          <button>확인</button>
        </div>

        <div className="inputWrap">
          <input 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // console.log(e.target.value)
            }}
            type="text"
            className="input" 
            placeholder="이메일을 입력해주세요."
          />
          <button>인증</button>
        </div>

        <div className="inputWrap">
            <input
              value={certify}
              onChange={(e) => {
                setCertify(e.target.value);
              }}            
              type="text"
              className="input" 
              placeholder="인증코드를 입력해주세요."
            />
            <button>확인</button>
            <button>재전송</button>
        </div>

        <div className="inputWrap">
          <input 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}          
            type="password"
            className="input" 
            placeholder="비밀번호를 입력해주세요."
          />
          <button>확인</button>
        </div>

        <div className="inputWrap">
          <input 
            value={secondPassword}
            onChange={(e) => {
              setSecondPassword(e.target.value);
            }}          
            type="password"
            className="input" 
            placeholder="비밀번호를 다시 입력해주세요."
          />
          <button>확인</button>
        </div>

      </div>

      <div>
        <button 
          onClick={() => {
            register()
          }}
          className="bottomButton">회원가입</button>
      </div>

    </div>
  )
}

export default SignUp