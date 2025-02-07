import React, { useState, useEffect } from "react"
import axiosInstance from "../../api/axiosInstance"
import InputBox from "../../components/common/input"
import FavoriteInput from "../../components/common/favoriteInput"
import Button from "../../components/common/Button"

function ProfileEdit () {

  const dummyImage = "/assets/default_profile.jpg"
  const nickname = "김싸피" 
  const introduce = "안녕하세요. 김싸피입니당~!"
  const defaultPlaces = ["광주", "대전", "세종"]
  const defaultGenres = ["folk", "blues", "disco"]

  //상태 변화 감지
  const [profileImage, setProfileImage] = useState<string>(dummyImage)
  const [selectedImage, setSelectedImage] = useState<string>("")

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
      setProfileImage(dummyImage)
      return
    }

    if(file) {
      if(file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다. 다른 이미지를 선택해주세요.')
        e.target.value=''
        setProfileImage(dummyImage)
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
  }
  //자기소개 수정 핸들러
  const handleIntroduceChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setChangedIntroduce(e.target.value)
  }
  // 선호 지역 수정 핸들러
  const handlePlaceChange = (selectedItems: string[]) => {
    setSelectedPlaces(selectedItems);
  };
  // 선호 장르 수정 핸들러 
  const handleGenreChange = (selectedItems: string[]) => {
    setSelectedGenres(selectedItems);
  };


  // 수정완료 axios 전송
  const handleSubmit = async () => {
    console.log("프로필 수정 시도")

    const formData = new FormData()


    if (selectedImage !== profileImage) {
      formData.append("profileImage", selectedImage)
    }

    if (changedNickName !== nickname){
      formData.append("nickName", changedNickName)
    }

    if (changedIntroduce !== introduce) {
      formData.append("intoduce", changedIntroduce)
    }

    if (selectedGenres !== defaultGenres) {
      selectedGenres.forEach((genre, index) => formData.append(`likeGenres${index +1}`, genre))
    }

    if (selectedPlaces !== defaultPlaces) {
      selectedPlaces.forEach((place, index) => formData.append(`likeRegion${index + 1}`, place))
    }

    try { 
      const res = await axiosInstance.post("/profileEdit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }) 
      console.log(res, "수정하기 완료")
    }catch (err) {
        console.error("수정하기 실패", err)
      }
    }
    
    // 입력값들이 다 유효하고, 수정을 할 경우 버튼 활성화하기 
    useEffect(() => {
      const hasChanged = 
        changedNickName !== nickname ||
        changedIntroduce !== introduce ||
        selectedPlaces.join(",") !== defaultPlaces.join(",") ||
        selectedGenres.join(",") !== defaultGenres.join(",") ||
        selectedImage !== "";
      setIsUpdated(hasChanged)

      setIsButtonDisabled(!(
        changedNickName.trim() !== "" &&
        changedIntroduce.trim() !== "" &&
        selectedPlaces.length === 3 &&
        selectedGenres.length === 3 &&
        isUpdated
      ))
    }, [changedNickName, changedIntroduce, selectedPlaces, selectedGenres]);
    

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
        text="수정하기"
        type="Large"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
      />

    </div> 
  )
}

export default ProfileEdit