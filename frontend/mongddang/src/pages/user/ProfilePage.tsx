import { useEffect, useState } from "react"
import {useLocation, useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import AlbumList from "../../components/album/AlbumCardList"
import Button from "../../components/common/Button"
import FollowButton from "../../components/common/followButton"

export interface MyAlbum {
  albumId: number
  title: string
  createdAt: string
  albumImageURL: string
}

export interface ProfileData {
  userId: number
  nickname: string
  profileImageURL: string
  introduce: string
  followStatus: boolean
  followingCnt: number
  followedCnt: number
  albums: MyAlbum[]
}

function ProfilePage () {
  
  const location = useLocation()
  //변경 감지용 state
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // 보려는 프로파일 페이지 사람의 정보
  const {userId} = useParams<{userId: string}>()
  const numberUserId = userId ? parseInt(userId, 10):null
  
  // 현재 로그인한 사람의 정보 가지고오기
  const loggedInUser = useAuth()
  const [loggedInUserId, setLoggedInUserId] = useState<number>()
  useEffect(() => {
    if(loggedInUser) {
      setLoggedInUserId(loggedInUser.userId)
    }
  }, [loggedInUser, userId])



  
  // 프로필 상태 변화 감지
  const [profileData, setProfileData] = useState<ProfileData>(
    {   
      userId: 0,
      nickname: "",
      profileImageURL: "",
      introduce: "",
      followStatus: false,
      followingCnt: 0,
      followedCnt: 0,
      albums: []
    }
  )
  
    //앨범이 하나도 없을 때 나오는 이미지 
    const defaultImage = "/assets/albumCover.jpg"
    
    // 이 프로필이 나의 프로필인지 확인
    const isMyProfile = loggedInUserId === numberUserId;
      

    //처음 렌더링 될 때 userId의 값에 따라 데이터 갖고오는 axios 
    useEffect(() => {
      if(!userId) return

      const fetchProfileData = async () => {
        console.log('프로필 조회 시도')
        try {
          const res = await axiosInstance.get<ProfileData>(`/profile/${userId}`,)
          setProfileData(res.data)
          console.log("서버 응답 데이터:", res.data)  
        }catch (err) {
          console.log('프로필 정보 확인 실패', err)
        }
      }
      fetchProfileData()
    }, [userId, location.state?.updated, updateTrigger])




    //팔로우 버튼 눌렀을 때 FollowStatus값 바꿔주기
    const changeFollowStatus = async () => {
      if(!userId) return
      
      // 만약 팔로우가 되어있지 않는다면
      try {
        if(!profileData.followStatus){
          const response = await axiosInstance.post(`/follow/${userId}`)
          setProfileData(prev => ({
            ...prev,
            followStatus: true,
            followedCnt: prev.followedCnt + 1
          }))
        } else {
          const response =await axiosInstance.delete(`/follow/${userId}`)
          setProfileData(prev => ({
            ...prev,
            followStatus: false,
            followedCnt: prev.followedCnt -1 
          }))
        }
      } catch(err) {
        console.log("팔로우 상태 변경 실패:", err)
      
      }
    }

    // 프로필 페이지로 이동 
    const nav = useNavigate()
    const goToProfileEdit = () => {
      return (
        nav("/profileEdit")
      )
    }

// --------------------------------------------------------------------//
  return(
    <div className="profileWrap">

      {/*앨범 커버 & 프로필 이미지 */}
      <div className="imageWrap">
        <img
          src={profileData.albums.length > 0 ? profileData.albums[0].albumImageURL : defaultImage} width="200"
         />
         <br/>
        <img src={profileData.profileImageURL} width="150"/>
      </div>

      {/* 유저 정보들 */}
      <div className="textWrap">
        <h4>{profileData.nickname}</h4>
        <h5>{profileData.introduce}</h5>

        <div className="followWrap">
          <span>팔로우 {profileData.followedCnt}</span>
          <span>팔로잉 {profileData.followingCnt}</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="button">

        {isMyProfile ? (
          <Button 
            type="ProfileEdit"
            onClick={goToProfileEdit}
            text="프로필 수정"
          />) :(
          <FollowButton
            text={profileData.followStatus ? "팔로잉" : "팔로우"}
            onClick={changeFollowStatus}
          />
          )
        }


      </div>

      {/* 앨범 정보들 */}
      <div className="albumsWrap">
        <AlbumList albums={profileData.albums}/>
      </div>

    </div>
  )
}

export default ProfilePage