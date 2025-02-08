import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useRecoilValue  } from "recoil"
import { userAtom } from "../../recoil/userAtom"
import axiosInstance from "../../api/axiosInstance"
import AlbumList from "../../components/album/AlbumCardList"

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
  followingCnt: number
  followedCnt: number
  albums: MyAlbum[]
}

function ProfilePage () {

  //앨범이 하나도 없을 때 나오는 이미지 
const defaultImage = "/assets/albumCover.jpg"

  
  
  const [profileData, setProfileData] = useState<ProfileData>(
    // 백이랑 통신할 때 주석 풀기
    // {    userId: 0,
    //     nickname: "",
    //     profileImageURL: "",
    //     introduce: "",
    //     followingCnt: 0,
    //     followedCnt: 0,
    //     albums: []}
    
    // 임시데이터
    { userId: 1,
      nickname: "민뚱",
      profileImageURL: "/assets/minjeong_profile.png",
      introduce: "안녕하세요. 민뚱입니다.",
      followingCnt: 42,
      followedCnt: 45,
      albums: [
        {
          "albumId": 1,
          "title": "Album 1",
          "createdAt": "2025-02-07T13:03:41.000+00:00",
          "albumImageURL": "/assets/albumCover.jpg"
        },
        {
          "albumId": 2,
          "title": "Album 2",
          "createdAt": "2025-01-07T13:03:41.000+00:00",
          "albumImageURL": "/assets/albumCover2.jpg"
        },
      ]}
    )
    // 현재 로그인한 유저인지 확인 백이랑 통신할 때 주석 바꾸기 
    // const loggedInUser = useRecoilValue(userAtom)
    const loggedInUser = 1
  
    
    //지금 내가 보려는 프로필 사용자의 ID 
  
    const {user_id} = useParams<{user_id: string}>()
    const numberUserId = user_id ? parseInt(user_id, 10) : null
  
    // 이 프로필이 나의 프로필인지 확인
    const isMyProfile = loggedInUser === numberUserId;
    console.log(
      "로그인한 유저 Id:", loggedInUser,
      "조회하려는 유저 Id:", numberUserId) 
    
  //처음 렌더링 될 때 userId의 값에 따라 데이터 갖고오는 axios 
  useEffect(() => {

    const fetchProfileData = async () => {
      console.log('프로필 조회 시도')
      try {
        const res = await axiosInstance.get<ProfileData>(`/profile/${user_id}`,)
        setProfileData(res.data)
        //데이터 확인해보기
        console.log(res) 
      }catch (err) {
        console.log('프로필 정보 확인 실패', err)
      }
    }

    fetchProfileData()
  }, [user_id])

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
          <span>팔로워 {profileData.followedCnt}</span>
          <span>팔로잉 {profileData.followingCnt}</span>
        </div>
      </div>

      <div className="button">
        <h1>{isMyProfile ? "이거 내 프로필" : "다른 사람 프로필" }</h1>
      </div>

      {/* 앨범 정보들 */}
      <div className="albumsWrap">
        <AlbumList albums={profileData.albums}/>
      </div>

    </div>
  )
}

export default ProfilePage