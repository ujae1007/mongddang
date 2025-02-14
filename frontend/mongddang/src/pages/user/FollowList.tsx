import { useEffect, useState } from "react";
import { GetfollowInfo } from "../../types";
import { getFollowingList, getFollowerList } from "../../api/follow";
import { useNavigate } from "react-router-dom";
import './FollowList.css'

interface FollowListProps {
  userId: string ;
  type: "followers" | "followings";
}

const FollowList = ({userId, type}: FollowListProps) => {

  const [lists, setLists] = useState<GetfollowInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {

      if (!userId) return; // userId가 없으면 API 호출하지 않음
      
      setIsLoading(true)


      try {
        // 만약에 팔로잉 버튼을 눌렀다면 팔로잉 API 호출
        const data = type === "followings"
          ? await getFollowingList(userId)
          : await getFollowerList(userId)
        setLists(data)
      }catch (err) {
        console.log("팔로우 목록 불러오기 실패:", err)
      } finally {
        setIsLoading(false) // 로딩중끝
      }
    }
    fetchUsers()
  }, [userId, type])

  // 로딩중일 때
  if (isLoading) {
    return (
      <div>로딩중... </div>
    )
  }
  
  return (
    <div>
      {lists.length > 0 ? (
        lists.map((user) => (
          <div className = "FollowMember"key={user.userId} onClick={() => nav(`/profile/${String(user.userId)}`)}>
            <img src={user.profileImageURL} alt="" width="100" />
            <div className="UserInfo">
              <div className="UserNickname">{user.nickname}</div>
              <div className="UserIntroduce">{user.introduce}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="FollowMemberList">
          <div className="NotFound">
            목록이 없습니다.
          </div>
        </div>
      )}
    </div>
  )
}


export default FollowList