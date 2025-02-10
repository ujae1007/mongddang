import React, { useState, useEffect } from "react"
import { useRecoilValue } from "recoil"
import { userAtom } from "../../recoil/userAtom"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import InputBox from "../../components/common/input"
import FavoriteInput from "../../components/common/favoriteInput"
import Button from "../../components/common/Button"

function ProfileEdit () {

  // 유저 정보 가져오기
  const loggedInUser = useRecoilValue(userAtom)

  //임시 데이터 백이랑 할 때 뒤에 임시데이터만 지우기 
  const profile_image_URL = loggedInUser?.profile_image_URL || "/assets/default_profile.jpg"
  const nickname = loggedInUser?.nickname || "김싸피" 
  const introduce = loggedInUser?.introduce || "안녕하세요. 김싸피입니당~!"
  const defaultPlaces = 
    // [
    //   loggedInUser?.like_rigion1,
    //   loggedInUser?.like_rigion2,
    //   loggedInUser?.like_rigion3,
    // ].filter(Boolean) 
    // || 
    ["광주", "대전", "세종"]
  const defaultGenres = 
    // [
    //   loggedInUser?.like_genre1,
    //   loggedInUser?.like_genre2,
    //   loggedInUser?.like_genre3,
    // ].filter(Boolean) 
    // || 
    ["folk", "blues", "disco"]

  //상태 변화 감지
  const [profileImage, setProfileImage] = useState<string>(profile_image_URL) //나의 원래 프로필사진
  const [selectedImage, setSelectedImage] = useState<string>("") // 만약 사진을 수정한다면 

  const [changedNickName, setChangedNickName] = useState(nickname)
  const [changedIntroduce, setChangedIntroduce] = useState(introduce)
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>(defaultPlaces)
  const [selectedGenres, setSelectedGenres] = useState<string[]>(defaultGenres)

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  
  const [isUpdated, setIsUpdated] = useState(false)

  //이미지 수정 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if(!file){
      setProfileImage(selectedImage || profile_image_URL)
      return
    }

    if(file) {
      if(file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다. 다른 이미지를 선택해주세요.')
        e.target.value=''
        // 만약 수정하고 또 수정하는 거면 첫번째 수정 이미지가 나와야함(기본 이미지X)
        if(selectedImage) {
          setProfileImage(selectedImage)
        }
        return 
      }
      const reader = new FileReader()
      reader.onload = () => {
        setIsUpdated(true)
        setSelectedImage(reader.result as string) 
        setProfileImage(reader.result as string) 
      }
      reader.readAsDataURL(file)
    }
  }
  //닉네임 수정 핸들러
  const handleNickNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setChangedNickName(e.target.value)
    setIsUpdated(true)
  }
  //자기소개 수정 핸들러
  const handleIntroduceChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setChangedIntroduce(e.target.value)
    setIsUpdated(true)
  }
  // 선호 지역 수정 핸들러
  const handlePlaceChange = (selectedItems: string[]) => {
    setSelectedPlaces(selectedItems)
    setIsUpdated(true)
  };
  // 선호 장르 수정 핸들러 
  const handleGenreChange = (selectedItems: string[]) => {
    setSelectedGenres(selectedItems)
    setIsUpdated(true)
  };

  //취소버튼 핸들러 
  //템플릿 리터럴에서는 문자열로 처리하기 때문에 문자열로 처리해줘야함. 
  //지금은 로그인된 유저가 없기 때문에 url에서 undefined가 나옴 백이랑 할 때 주석 교체 
  const nav = useNavigate()
  const goToBack = () => {
    // nav(`/profile/${loggedInUser?.user_id.toString()}`) 
    nav(-1)
  }

  // 수정하기 axios 전송
  const handleSubmit = async () => {
    console.log("프로필 수정 시도")
    console.log(
      "업데이트 된 데이터:",
      changedNickName,
      changedIntroduce,
      selectedPlaces,
      selectedGenres,
    )

    const formData = new FormData()

    if (selectedImage !== profileImage) {
      formData.append("profile_image_URL", selectedImage)
    }

    if (changedNickName !== nickname){
      formData.append("nickname", changedNickName)
    }

    if (changedIntroduce !== introduce) {
      formData.append("introduce", changedIntroduce)
    }

    if (JSON.stringify(selectedGenres) !== JSON.stringify(defaultGenres)) {
      selectedGenres.forEach((genre, index) => formData.append(`like_genre${index +1}`, genre))
    }

    if  (JSON.stringify(selectedPlaces) !== JSON.stringify(defaultPlaces)) {
      selectedPlaces.forEach((place, index) => formData.append(`like_region${index + 1}`, place))
    }

    try { 
      const res = await axiosInstance.put("/auth/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }) 
      console.log(res, "수정하기 완료")
      nav(`/profile/${loggedInUser?.user_id.toString()}`)
    }catch (err) {
        console.error("수정하기 실패", err)
      }
    }
    
    // 입력값들이 다 유효하고, 수정을 할 경우 버튼 활성화하기 
    useEffect(() => {

      setIsButtonDisabled(!(
        changedNickName.trim() !== "" &&
        changedIntroduce.trim() !== "" &&
        selectedPlaces.length === 3 &&
        selectedGenres.length === 3 &&
        isUpdated
      ))
    }, [changedNickName, changedIntroduce, selectedPlaces, selectedGenres, isUpdated]);
    
    //회원탈퇴하기
    const deleteUser = async () => {
      try {
        const res = await axiosInstance.delete('/auth/signout')
        console.log("회원탈퇴 완료:", res)
      } catch(err) {
        console.log("회원탈퇴 실패:",err)
      }
    }

  return (
    <div>
      <div className="imageWrap">
        <img src={profileImage} alt="profile" className="profileImage" width="100"/>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="inputWrap">

        <div className="nickname">
          <h6 className="subtitle" >닉네임</h6>
            <InputBox 
              type="default"   
              mode="edit"
              onChange={handleNickNameChange}     
              value={changedNickName}
          />
        </div>


        <div className="introduce">
          <h6 className="subtitle" >자기소개</h6>
            <InputBox 
              type="default"  
              mode="edit" 
              onChange={handleIntroduceChange}     
              value={changedIntroduce}
          />
        </div>

        <div className="favorite">
          <FavoriteInput
            type="place"
            placeholder={"선호하는 지역을 선택해주세요."}
            onChange={handlePlaceChange}
            defaultValues={selectedPlaces}
            mode="edit"
          />
          <FavoriteInput
            type="genre"
            placeholder={"선호하는 음악 장르를 선택해주세요."}
            onChange={handleGenreChange}
            defaultValues={selectedGenres}
            mode="edit"
          />
        </div>

      </div>

      <Button
        text="취소하기"
        type="Middium"
        onClick={goToBack}
      />

      <Button
        text="수정하기"
        type="Middium"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
      />

      <p onClick={deleteUser}>계정을 삭제하시겠습니까?</p>
    </div> 
  )
}

export default ProfileEdit