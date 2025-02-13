import { useEffect, useState } from "react"
import {useParams } from "react-router-dom"
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
          console.log('프로필 주인 데이터:', res.data);  
        } catch (err) {
          console.log('프로필 정보 확인 실패', err);
        }
      };  
      fetchProfileData();
    }, [userId]);


    //팔로우 버튼 눌렀을 때 FollowStatus값 바꿔주기
    const changeFollowStatus = async () => {
      if(!userId) return
      
      // 만약 팔로우가 되어있지 않는다면
      if(!profileData.followStatus){
        const res =  await axiosInstance.post(`/follow/${userId}`)
        console.log("팔로우 성공", res)
      } else {
        const res = await axiosInstance.delete(`/follow/${userId}`)
        console.log("언팔로우 성공", res)
      }
      try {
        setProfileData((prev) => {
          const newFollowStatus = !prev.followStatus // 현재 팔로우 값을 바꿔 만약 팔로우 안했는데 팔로잉을 한다? 
          // 만약 팔로우를 안했다가 해서 값이  트루로 바뀌면 followedCnt 를 1올려. 
          const newFollowedCnt = newFollowStatus ? prev.followedCnt + 1 : prev.followedCnt -1
          // 그리고 갱신을 해. 
          return {
            ...prev,
            followStatus: newFollowStatus,
            followedCnt: newFollowedCnt 
          }
        })
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

<<<<<<< HEAD
=======
    // 팔로잉 페이지로 이동
    const goToFollowingList = () => {
      nav('/follow', {replace:true , state: {tab: "followings"}})
    }

    //팔로워 페이지로 이동
    const goToFollowerList = () => {
      nav('/follow', {replace:true , state: {tab: "followers"}})
    }
>>>>>>> cb9510a43e6f13edd2fd7a90ab6cc9d3bc7c9982
// --------------------------------------------------------------------//
  return(
    <div className="profileWrap">

      {/*앨범 커버 & 프로필 이미지 */}
      <div className="imageWrap">
        <img
          src={profileData.albums && profileData.albums.length > 0 && profileData.albums[0].albumImageURL ? profileData.albums[0].albumImageURL : defaultImage} width="200"
         />
         <br/>
        <img src={profileData.profileImageURL} width="150"/>
      </div>

      {/* 유저 정보들 */}
      <div className="textWrap">
        <h4>{profileData.nickname}</h4>
        <h5>{profileData.introduce}</h5>

<<<<<<< HEAD
        <div className="followWrap">
          <span>팔로워 {profileData.followedCnt}</span>
          <span>팔로잉 {profileData.followingCnt}</span>
=======
      {/* 나의 프로필일때는 팔로워 팔로잉 버튼 클릭할 수 있도록 */}
        <div className="followWrap">
          {
          isMyProfile? 
            (
              <>
                <span onClick={goToFollowerList}>팔로워 {profileData.followedCnt}</span>
                <span onClick={goToFollowingList}>팔로잉 {profileData.followingCnt}</span>
              </>
            ) 
          : 
            (
              <>
                <span>팔로잉 {profileData.followingCnt}</span>
                <span>팔로워 {profileData.followedCnt}</span>
              </>
            )
          }

>>>>>>> cb9510a43e6f13edd2fd7a90ab6cc9d3bc7c9982
        </div>
      </div>

      {/* 버튼 */}
      <div className="button">

        {isMyProfile ? (
          <Button 
            type="ProfileEdit"
            onClick={goToProfileEdit}
            text="프로필 수정"
<<<<<<< HEAD
          />) :(
=======
          />
        ) 
        :
        (
>>>>>>> cb9510a43e6f13edd2fd7a90ab6cc9d3bc7c9982
          <FollowButton
            text={profileData.followStatus ? "팔로잉" : "팔로우"}   //false로 일단 주니까 flase라면 팔로우버튼이 나오고 true면 팔로잉 버튼이 나오도록 
            onClick={changeFollowStatus}
          />
<<<<<<< HEAD
          )
=======
        )
>>>>>>> cb9510a43e6f13edd2fd7a90ab6cc9d3bc7c9982
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