import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import InputBox from "../../components/common/input"
import FavoriteInput from "../../components/common/favoriteInput"
import Button from "../../components/common/Button"
import useAuth from "../../hooks/useAuth"

function ProfileEdit () {

  // 유저 정보 가져오기 비동기적으로 가져옴 
  const loggedInUser = useAuth()
  const [loggedInUserId, setLoggedInUserId] = useState<number>()

  const preProfileImg = "REMOVED"

  //기존 데이터 불러오기
  useEffect (() => {
    if(loggedInUser) {
      setProfileImage(loggedInUser.profileImageURL || '') // 기존 프로필이나 디폴드 값
      setChangedNickName(loggedInUser.nickname || '')
      setChangedIntroduce(loggedInUser.introduce || '')
      setLoggedInUserId(loggedInUser.userId)

      const places = [
        loggedInUser.likeRegion1,
        loggedInUser.likeRegion2,
        loggedInUser.likeRegion3,
      ].filter(Boolean) as string[]
      setSelectedPlaces(places)

      const genres = [
        loggedInUser.likeGenre1,
        loggedInUser.likeGenre2,
        loggedInUser.likeGenre3,
      ].filter(Boolean) as string[]
      setSelectedGenres(genres)
    }
  }, [loggedInUser])

  //상태 변화 감지
  const [profileImage, setProfileImage] = useState<string | null>(""); 
  const [changedNickName, setChangedNickName] = useState('')
  const [changedIntroduce, setChangedIntroduce] = useState('')
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  
  const [isUpdated, setIsUpdated] = useState(false)

  
  //이미지 수정 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    //만약 취소를 눌렀다면 마지막으로 했던거 나오기 
    if(!file){
      setProfileImage(profileImage)
      return
    }
    
    if(file) {
      if(file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다. 다른 이미지를 선택해주세요.')
        e.target.value=''
        // 만약 수정하고 또 수정하는 거면 첫번째 수정 이미지가 나와야함(기본 이미지X)
        if(profileImage) {
          setProfileImage(profileImage)
        }
        return 
      }
      const reader = new FileReader()
      reader.onload = () => {
        setIsUpdated(true)
        setProfileImage(reader.result as string) 
      }
      reader.readAsDataURL(file)
    }
  }
  
  //이미지 삭제 버튼 핸들러 
  const handleImageDelete = () => {
    setProfileImage(null)
    setIsUpdated(true)
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
  const nav = useNavigate()
  const goToBack = () => {
    nav(-1)
  }

   // 수정하기 axios 전송
   const handleSubmit = async () => {
    console.log("프로필 수정 시도")
    console.log(
      "업데이트 된 데이터:",
      profileImage,
      changedNickName,
      changedIntroduce,
      selectedPlaces,
      selectedGenres,
    ) // 변화된 값이 담겨있음 확인 완료 

    const formData = new FormData()
    formData.append("nickname", changedNickName)
    formData.append("introduce", changedIntroduce)
    formData.append("likeRegion1", selectedPlaces[0] || "")
    formData.append("likeRegion2", selectedPlaces[1] || "")
    formData.append("likeRegion3", selectedPlaces[2] || "")
    formData.append("likeGenre1", selectedGenres[0] || "")
    formData.append("likeGenre2", selectedGenres[1] || "")
    formData.append("likeGenre3", selectedGenres[2] || "")
  
    // 프로필 이미지 변경이 있을 경우 추가
    if (profileImage && profileImage !== "") {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        formData.append("profileImage", fileInput.files[0])
      }
    }

    try { 
      const res = await axiosInstance.put("/auth/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }) 
      console.log(res, "수정하기 완료")
      nav(`/profile/${loggedInUserId}`, {replace:true, state: { updated: true }})
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

      const isConfirmed = window.confirm("정말 탈퇴하시겠습니까? 탈퇴 후 계정 복구는 불가능합니다.")
      if (!isConfirmed) return
      
      try {
        const res = await axiosInstance.delete('/auth/signout')
        alert("회원 탈퇴가 완료되었습니다.");
        console.log("회원탈퇴 완료:", res)
        nav('/mongddang', {replace:true})
      } catch(err) {
        console.log("회원탈퇴 실패:",err)
      }
    }

  return (
    <div>
      <div className="imageWrap">
        <img src={profileImage || preProfileImg} alt="profile" className="profileImage" width="100"/>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button onClick={handleImageDelete}>삭제</button>

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