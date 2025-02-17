import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import InputBox from "../../components/common/input"
import FavoriteInput from "../../components/common/favoriteInput"
import axiosInstance from "../../api/axiosInstance"
import { useRecoilValue } from "recoil"
import { authTokenAtom } from "../../recoil/userAtom"
import './SignUp.css'
function SignUp () {

  // const defaultImage = "REMOVED"
  const nav = useNavigate()
  const authToken = useRecoilValue(authTokenAtom)

  useEffect(() => { 
    if (authToken) {
      alert("로그아웃 후 이용하세요.");
      nav(-1);
    } 
  }, [authToken, nav]);
  
  //상태변화 감지
  // const [profileImage, setProfileImage] = useState<string>(defaultImage)
  const [nickName, setNickName] = useState("")
  const [introduce, setIntroduce] = useState("")
  const [email, setEmail] = useState("")
  const [certify, setCertify] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")
  const [selecetedGenres, setSelecetedGenres] = useState<string[]>([])
  const [selecetedPlaces, setSelecetedPlaces] = useState<string[]>([])
  
  // 사진, 이메일, 인증코드, 비밀번호 유효성 검사
  // const [profileImageValid, setProfileImageValid] = useState<boolean>(true)

  const [emailValid, setEmailValid] = useState<boolean>(false)
  const [isEmailAvailable, setisEmailAvailable] = useState<boolean>(false)
  
  // const [certifyValid, setCertifyValid] = useState<boolean>(false)
  const [isCertifyConfirmed, setIsCertifyConfirmed] = useState(false);
  
  const [passwordValid, setPasswordValid] = useState<boolean>(false)
  const [secondpasswordValid, setSecondPasswordValid] = useState<boolean>(false)
  const [passwordMatchMessage, setPasswordMatchMessage] = useState<string | null>(null)

  // 프로파일 이미지 핸들러
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if(file) {
  //     if(file.size > 5 * 1024 * 1024) {
  //       alert('파일 크기는 5MB를 초과할 수 없습니다. 다른 이미지를 선택해주세요.')
  //       setProfileImageValid(false)
  //       e.target.value=''
  //       setProfileImage(profileImage || defaultImage)
  //       return 
  //     }
  //     const reader = new FileReader()
  //     reader.onload = () => {
  //       setProfileImage(reader.result as string)
  //       setProfileImageValid(true)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // 이메일 인증 axios
  const handleEmailVerification = () => {
    console.log("이메일 존재확인 시도")
    axiosInstance
      .post("/auth/sendemail", {email})
      .then((res) => {
        if (res.status === 200)
          console.log("새로운 사용자 확인 완료", res.data)
          alert("이메일 인증 코드가 발송되었습니다.")
          setisEmailAvailable(true)
      })
      .catch((err) => {
        if(err.response?.status === 400) {
          console.log("이미 가입된 회원입니다.")
          alert("이미 가입된 이메일입니다.")
        } else {
          console.log("인증코드 발송 중 오류 발생:", err)
          alert("인증과정에서 오류가 발생했습니다. 다시 시도해주세요.")
        }
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
  //인증코드, 확인용 비밀번호 핸들러
  const handlerCertifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertify(e.target.value)
    // setCertifyValid(e.target.value.length > 0)
  }
  const handlerSecondPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSecondPassword = e.target.value
    setSecondPassword(newSecondPassword)
    // setSecondPasswordValid(secondPassword.length > 0 && password === secondPassword);
    if (password === newSecondPassword){
      setPasswordMatchMessage("비밀번호가 일치합니다.")
      setSecondPasswordValid(true)
    } else {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다.")
      setSecondPasswordValid(false)

    }
  }

  // 모든 작업이 완료될 시 회원가입 버튼 활성화 핸들러 
  const isSignUpEnabled =
    // (profileImage || profileImageValid ) && // 기본 프로파일 혹은 유저가 올린 사진
    nickName && //닉네임을 작성했는지
    introduce && //자기소개를 작성했는지
    email &&  //이메일을 작성했는지 
    emailValid && //이메일의 형식이 맞는지 
    isEmailAvailable &&//기존 사용자가 아닌지 
    certify && //인증번호를 입력했는지 
    isCertifyConfirmed && // 인증번호가 맞는지 
    password && //첫 번째 비밀번호를 작성했는지 
    passwordValid && // 첫 번째 비밀번호가 형식이 맞는지 
    secondPassword && // 두 번째 비밀번호를 작성했는지 
    secondpasswordValid && // 두 번째 비밀번호가 첫 번째 비밀번호와 일치하는지 
    password === secondPassword && // 첫 번째 비밀번호와 두 번째 비밀번호가 일치하는지 (빼도 될 듯)
    selecetedGenres.length ===3 && //노래 장르를 3가지 선택했는지 
    selecetedPlaces.length === 3; // 선호 장소를 3가지 선택했는지 
  
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
    axiosInstance
      .post("/auth/verifycode", {"code":certify, "email":email})
      .then((res) => {
        if (res.status === 200) {
          console.log("인증에 성공하였습니다.")
          setIsCertifyConfirmed(true)
          alert("이메일 인증이 완료되었습니다.")
        }
      })
      .catch((err) => {
        if(err.response?.status === 400){
          console.log("이메일 인증 실패: 인증코드가 일치하지 않습니다.")
          setIsCertifyConfirmed(false)
          alert("인증코드가 올바르지 않습니다. 다시 확인해주세요.")
        } else {
          console.log("인증 확인 중 오류 발생:", err)
          alert("인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.")
        }
      })
  }

  //비밀번호 일치 검사
  // const checkPassword = () => {
  //   setSecondPasswordValid(secondPassword.length > 0 && password === secondPassword);
  //   if (password === secondPassword){
  //     setPasswordMatchMessage("비밀번호가 일치합니다.")
  //     setSecondPasswordValid(true)
  //   } else {
  //     setPasswordMatchMessage("비밀번호가 일치하지 않습니다.")
  //     setSecondPasswordValid(false)

  //   }
  // }

// 회원정보 axios 최종전송
  const register = () => {
    console.log("회원가입 시도")
    console.log(
    // profileImage || profileImageValid ,// 기본 프로파일 혹은 유저가 올린 사진
    nickName ,//닉네임을 작성했는지
    introduce , //자기소개를 작성했는지
    email ,  //이메일을 작성했는지 
    emailValid , //이메일의 형식이 맞는지 
    isEmailAvailable,//기존 사용자가 아닌지 
    certify , //인증번호를 입력했는지 
    isCertifyConfirmed, // 인증번호가 맞는지 
    password , //첫 번째 비밀번호를 작성했는지 
    passwordValid , // 첫 번째 비밀번호가 형식이 맞는지 
    secondPassword , // 두 번째 비밀번호를 작성했는지 
    secondpasswordValid , // 두 번째 비밀번호가 첫 번째 비밀번호와 일치하는지 
    password === secondPassword , // 첫 번째 비밀번호와 두 번째 비밀번호가 일치하는지 (빼도 될 듯)
    selecetedGenres.length ===3 , //노래 장르를 3가지 선택했는지 
    selecetedPlaces.length === 3 // 선호 장소를 3가지 선택했는지 
    )

    const formData = new FormData()
    const fileInput = document.querySelector("#profile-upload") as HTMLInputElement
    const file = fileInput?.files?.[0]

    if(file) formData.append('profileImage', file)
    formData.append('nickname', nickName.trim())
    formData.append('introduce', introduce.trim())
    formData.append('email', email)
    formData.append('password', password)
    selecetedGenres.forEach((genre, index) => formData.append(`likeGenre${index + 1}`, genre)) 
    selecetedPlaces.forEach((place, index) => formData.append(`likeRegion${index +1}`, place))
    

    axiosInstance
    .post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // 위에있는게 끝나지 않으면 실행X
    .then((res) => {
      console.log('회원가입 성공')
      console.log(res)
      //로그인 이동 
      nav('/login', {replace:true})
    })
    .catch((err) => {
      console.log('회원가입 실패', err)
    })
  }
  
  // 로그인 계정으로 이동
  const goToLogin = () => {
    nav('/login', {replace:true})
  }

// -----------------------------------------------------------------------------
  return (
    <div className="SignUp">
    

      <div className="TitleWrap">
        <div className="title">Sign Up</div>
        <div className="icornImageWrap">
          <img src="../../public/assets/회원가입.png" alt="" width="188px" />
        </div>
      </div>

{/*이미지 */}
      {/* <div className="profileImageWrap">

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
      </div> */}



{/* 이메일 */}
        <div className="emailWrap">
          <InputBox 
            type="default" 
            mode="signup"
            placeholder="이메일을 입력해주세요."
            onChange={(e) => {
              setEmail(e.target.value)
              handleEmail(e)
            }}
            value={email}
          />
          <Button 
            text="인증"
            type="confirm"
            onClick={handleEmailVerification}
            disabled={!emailValid}
          />
        </div>
          <div className="errorMessageWrap">
            {
              !emailValid && email.length > 0 && (
                <div>올바른 이메일을 입력해주세요.</div>
              )
            }
          </div>

{/* 인증코드 */}
        <div className="certifyWrap">
          <InputBox 
            type="default" 
            mode="signup"
            placeholder="인증코드를 입력해주세요."
            onChange={handlerCertifyChange}
            value={certify}
          />
          <Button
            text="확인"
            type="confirm"
            onClick={handleCertifyVerification}
            disabled={!isEmailAvailable}
          />
          <Button
            text="재전송"
            type="confirm"
            onClick={handleEmailVerification}
            disabled={!isEmailAvailable}
          />          
        </div>

{/* 닉네임 */}
        <div className="nickNameWrap"> 
          <InputBox 
            type="default" 
            mode="signup"
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
          mode="signup"
          placeholder="자기소개를 입력해주세요."
          onChange={(e) => {
            setIntroduce(e.target.value)
          }}
          value={introduce}
        />

      </div>

{/* 비밀번호 */}
        <div className="passwordWrap">
          <InputBox 
            type="password" 
            mode="signup"
            placeholder="비밀번호를 입력해주세요."
            onChange={handlePassword}
            value={password}
          />
        </div>
        <div className="errorMessageWrap">
          {
            !passwordValid && password.length > 0 && (
              <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
            )
          }
        </div>

{/* 비밀번호 확인 */}
        <div className="secondPasswordWrap">
          <InputBox 
            type="password" 
            mode="signup"
            placeholder="비밀번호를 다시 입력해주세요."
            onChange={handlerSecondPasswordChange}
            value={secondPassword}
          />
          {/* <Button
            text="확인"
            type="Small"
            onClick={checkPassword}
            disabled={!secondPassword}
          /> */}
        </div>
          {passwordMatchMessage && (
          <div className={`passwordMessage ${passwordMatchMessage.includes("일치하지 않습니다") ? "error" : "success"}`}>
            {passwordMatchMessage}
          </div>
        )}

{/* 선호장르 받기 */}
    <div>
      <FavoriteInput 
        type="genre"
        placeholder={"선호하는 음악 장르를 선택해주세요."}
        onChange={handleGenreChange}
        mode="signup"
      />
      <FavoriteInput 
        type="place"
        placeholder={"선호하는 여행지를 선택해주세요."}
        onChange={handlePlaceChange}
        mode="signup"
      />

    </div>

{/* 회원가입 버튼 */}
        <div className="signUpButton">
          <Button 
            text="회원가입"
            type="Large"
            onClick={register}
            disabled={!isSignUpEnabled}
          />
        </div>

        <div className="test">
          <p>이미 계정이 있으신가요? <span onClick={goToLogin} style={{ color: '#9747FF' }}>로그인</span></p>
        </div>
        
          
      </div>
)}

export default SignUp