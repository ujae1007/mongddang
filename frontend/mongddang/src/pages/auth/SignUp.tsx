// 이메일 인증할 때 DB에 있는지 확인하는 과정. 

import {useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import InputBox from "../../components/common/input"
import FavoriteInput from "../../components/common/favoriteInput"

function SignUp () {

  const defaultImage = "/assets/default_profile.jpg"
  const nav = useNavigate()
  
  //상태변화 감지
  const [profileImage, setProfileImage] = useState<string>(defaultImage)
  const [nickName, setNickName] = useState("")
  const [introduce, setIntroduce] = useState("")
  const [email, setEmail] = useState("")
  const [certify, setCertify] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")
  const [selecetedGenres, setSelecetedGenres] = useState<string[]>([])
  const [selecetedPlaces, setSelecetedPlaces] = useState<string[]>([])




  // 프로파일 이미지 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이메일, 인증코드, 비밀번호 유효성 검사
  const [emailValid, setEmailValid] = useState<boolean>(false)
  const [certifyValid, setCertifyValid] = useState<boolean>(false)
  const [passwordValid, setPasswordValid] = useState<boolean>(false)
  const [secondpasswordValid, setSecondPasswordValid] = useState<boolean>(false)
  const [passwordMatchMessage, setPasswordMatchMessage] = useState<string | null>(null)
  const [isCertifyConfirmed, setIsCertifyConfirmed] = useState(false);

  // 이메일 인증 axios
  const handleEmailVerification = () => {
    console.log("이메일 코드 전송시도")
    axios
      .post("http://localhost:8080/api/auth/sendemail", {email})
      .then((res) => {
          console.log("코드 전송 시도", res.data)
          alert("이메일 인증 코드가 발송되었습니다.")
      })
      .catch((err) => {
        console.log("이메일 코드 전송실패", err)
      })
  }

  //이메일&비밀번호 유효성 검증 핸들러
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(e.target.value)
    // console.log(e.target.value)
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
  //인증코드, 확인용 비밀번호, 회원가입 버튼 활성화 핸들러
  const handlerCertifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertify(e.target.value)
    setCertifyValid(e.target.value.length > 0)
  }
  const handlerSecondPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondPassword(e.target.value)
    setSecondPasswordValid(e.target.value.length > 0)
  }
  const isSignUpEnabled =
    nickName.length > 0 &&
    introduce.length > 0 &&
    emailValid &&
    //인증코드 확인되면 그 때 주석 풀기 
    // isCertifyConfirmed &&
    passwordValid &&
    secondpasswordValid &&
    password === secondPassword &&
    selecetedGenres.length ===3 &&
    selecetedPlaces.length === 3;
  
  //장르, 여행지 선택 핸들러
  const handleGenreChange = (genres: string[]) => {
    setSelecetedGenres(genres)
  }
  const handlePlaceChange = (places: string[]) => {
    setSelecetedPlaces(places)
  }

  //인증번호 axios
  const handleCertifyVerification = () => {
    console.log("인증코드 확인시도")
    axios
      .post("http://localhost:8080/api/auth/verifycode", {certify})
      .then((res) => {
        console.log("인증코드 인증시도",res.data)
        setIsCertifyConfirmed(true)
      })
      .catch((err) => {
        console.log("인증코드 확인실패", err)
        setIsCertifyConfirmed(false)
      })
  }

  //비밀번호 일치 검사
  const checkPassword = () => {
    setSecondPasswordValid(secondPassword.length > 0 && password === secondPassword);
    if (password === secondPassword){
      setPasswordMatchMessage("비밀번호가 일치합니다.")
      setSecondPasswordValid(true)
    } else {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다.")
      setSecondPasswordValid(false)

    }
  }

// 회원정보 axios 최종전송
  const register = () => {
    console.log("회원가입 시도")
    console.log(
      nickName.length > 0 ,
      introduce.length > 0,
      emailValid ,
      isCertifyConfirmed ,
      passwordValid ,
      secondpasswordValid ,
      password === secondPassword ,
      selecetedGenres.length ===3 ,
      selecetedPlaces.length === 3,
    )

    const formData = new FormData()
    const fileInput = document.querySelector("#profile-upload") as HTMLInputElement
    const file = fileInput?.files?.[0]
    if(file && file.size > 5 * 1024 * 1024) {
      formData.append('profileImage', file)
      alert('파일 크기는 5MB를 초과할 수 없습니다.')
      return 
    }

    if(file) formData.append('profileImage', file)
    formData.append('nickname', nickName.trim())
    formData.append('introduce', introduce.trim())
    formData.append('email', email)
    formData.append('password', password)
    selecetedGenres.forEach((genre) => formData.append('likeGenre', genre))
    selecetedPlaces.forEach((place) => formData.append('likeRegion', place))
    

    axios
    .post('http://localhost:8080/api/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // 위에있는게 끝나지 않으면 실행X
    .then((res) => {
      console.log('회원가입 성공')
      //여기 아래 어떤 내용인지 확인필요
      console.log(res.data.jwt)
      localStorage.setItem('jwt',res.data.jwt)
      //이름 확인, 경로 확인
      const userId = res.data.userId
      //메인페이지로 이동 주소확인해봐야함 
      nav(`/home/${userId}`, {replace:true})
    })
    .catch((err) => {
      console.log('회원가입 실패', err)
    })
  }
  
  // 로그인 계정으로 이동
  const goToLogin = () => {
    nav('/login', {replace:true})
  }
  return (
    <div className="SignUp">

      <div className="TitleWrap">SignUp</div>

{/*이미지 */}
      <div className="imageWrap">

        <label htmlFor="profile-upload">
          <img 
            src={profileImage} 
            alt="Profile Preview" 
            width="100" 
          />
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>


{/* 닉네임 */}
        <div className="nickNameWrap"> 
          <InputBox 
            type="default" 
            placeholder="닉네임을 입력해주세요."
            onChange={(e) => {
              setNickName(e.target.value)
            }}
            value={nickName}
          />
        </div>

{/* 자기소개 */}
      <div className="introduceWrap">
        <InputBox 
          type="default"
          placeholder="자기소개를 입력해주세요."
          onChange={(e) => {
            setIntroduce(e.target.value)
          }}
          value={introduce}
        />

      </div>

{/* 이메일 */}
        <div className="emailWrap">
          <InputBox 
            type="default" 
            placeholder="이메일을 입력해주세요."
            onChange={(e) => {
              setEmail(e.target.value)
              handleEmail(e)
            }}
            value={email}
          />
          <div className="errorMessageWrap">
            {
              !emailValid && email.length > 0 && (
                <div>올바른 이메일을 입력해주세요.</div>
              )
            }
          </div>
          <Button 
            text="인증"
            type="small"
            onClick={handleEmailVerification}
            disabled={!emailValid}
          />
        </div>

{/* 인증코드 */}
        <div className="certifyWrap">
          <InputBox 
            type="default" 
            placeholder="인증코드를 입력해주세요."
            onChange={handlerCertifyChange}
            value={certify}
          />
          <Button
            text="확인"
            type="small"
            onClick={handleCertifyVerification}
            disabled={!certifyValid}
          />
          <Button
            text="재전송"
            type="small"
            onClick={handleEmailVerification}
            disabled={!certifyValid}
          />          
        </div>

{/* 비밀번호 */}
        <div className="passwordWrap">
          <InputBox 
            type="password" 
            placeholder="비밀번호를 입력해주세요."
            onChange={handlePassword}
            value={password}
          />
        <div className="errorMessageWrap">
          {
            !passwordValid && password.length > 0 && (
              <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
            )
          }
        </div>
        </div>

{/* 비밀번호 확인 */}
        <div className="secondPasswordWrap">
          <InputBox 
            type="password" 
            placeholder="비밀번호를 다시 입력해주세요."
            onChange={handlerSecondPasswordChange}
            value={secondPassword}
          />
          <Button
            text="확인"
            type="small"
            onClick={checkPassword}
            disabled={!secondpasswordValid}
          />
          {passwordMatchMessage && (
          <div className={`passwordMessage ${passwordMatchMessage.includes("일치하지 않습니다") ? "error" : "success"}`}>
            {passwordMatchMessage}
          </div>
        )}
        </div>

{/* 선호장르 받기 */}
    <div>
      <FavoriteInput 
        type="genre"
        placeholder={"선호하는 음악 장르를 선택해주세요."}
        onChange={handleGenreChange}
      />
      <FavoriteInput 
        type="place"
        placeholder={"선호하는 여행지를 선택해주세요."}
        onChange={handlePlaceChange}
      />

    </div>

{/* 회원가입 버튼 */}
        <div className="signUpButton">
          <Button 
            text="회원가입"
            type="Large"
            onClick={register}
            disabled={!isSignUpEnabled}
            // disabled={false}
          />
        </div>

        <p onClick={goToLogin}>이미 계정이 있으신가요?</p>
        
          
      </div>
)}

export default SignUp