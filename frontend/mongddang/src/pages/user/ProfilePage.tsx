import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
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

  const {userId} = useParams<{userId: string}>()
  const [profileData, setProfileData] = useState<ProfileData>(
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

  //처음 렌더링 될 때 userId의 값에 따라 데이터 갖고오는 axios 
  useEffect(() => {

    const fetchProfileData = async () => {
      console.log('프로필 조회 시도')
      try {
        const res = await axiosInstance.get<ProfileData>(`/profile/${userId}`,)
        setProfileData(res.data)
        //데이터 확인해보기
        console.log(res) 
      }catch (err) {
        console.log('프로필 정보 확인 실패', err)
      }
    }

    fetchProfileData()
  }, [userId])

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

      {/* 앨범 정보들 */}
      <div className="albumsWrap">
        <AlbumList albums={profileData.albums}/>
      </div>

    </div>
  )
}

export default ProfilePage