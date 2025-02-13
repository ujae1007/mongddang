// 팔로우에 사용되는 api 호출 
import axiosInstance from "./axiosInstance"
import { GetfollowInfo } from "../types"

export const getFollowerList = async (userId:string): Promise<GetfollowInfo[]> => {
  try {
    const res = await axiosInstance.get(`/follow/find-followedUsers/${userId}`)
    return res.data
  } catch (err) {
    console.log("팔로워 리스트 가져오기 실패:", err)
    return [] // 만약 실패를 했을 때 undefined가 나오는 것을 방지하기 위해 
  }
}

export const getFollowingList = async (userId:string): Promise<GetfollowInfo[]> => {
  try {
    const res = await axiosInstance.get(`follow/find-followingUsers/${userId}`)
    return res.data
  } catch (err) {
    console.log("팔로잉 리스트 가져오기 실패", err)
    return []
  }
}