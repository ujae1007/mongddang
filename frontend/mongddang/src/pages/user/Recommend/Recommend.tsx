import { useNavigate } from "react-router-dom"
import { authTokenAtom } from "../../../recoil/userAtom"
import { useRecoilValue } from "recoil"
import { useEffect } from "react"
import RecommendSection from "./RecommendSection"
import PopularSection from "./PopularSection"

const RecommendPage = () => {

  const nav = useNavigate()
  const authToken = useRecoilValue(authTokenAtom)
  
  //로그인 안되어있는 유저라면 
  useEffect(() =>{
    if(!authToken) {
      alert("로그인 후 이용하세요.");
      nav("/login", {replace: true});
    }})

  
  return (
    <div>
      <RecommendSection />
      <PopularSection />
    </div>
  )
}

export default RecommendPage