import "./BottomNav.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

interface BottomNavProps {
  type: "Home" | "Recommend" | "Create" | "Search" | "Like" | "Default"
  onClick: () => void
  name: string
}

const BottomNav = ({type, onClick, name}:BottomNav) => {
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState<BottomNavProps["type"]>("Default"); // 해당 타입에 속하지 않는 페이지의 경우 default

  // 이동할 각 페이지 
  const navItems: Array<BottomNavProps> = [
    {
      type: "Home",
      onClick: () => navigate("/mainpage"),
      name: "홈",
    },
    {
      type: "Recommend",
      onClick: () => navigate("/recommend"),
      name: "추천",
    },
    {
      type: "Create",
      onClick: () => navigate("/create"),
      name: "추가",
    },
    {
      type: "Search",
      onClick: () => navigate("/search"),
      name: "검색",
    },
    {
      type: "Like",
      onClick: () => navigate("/likes"),
      name: "저장",
    },
  ];

  return (
    <div className="bottomNav">
      {navItems.map((item) => (
        <div
          key={item.type}
          className={`bottomNavItem ${activeType === item.type ? "active" : ""}`}
          onClick={() => {
            setActiveType(item.type); // 활성화된 버튼을 업데이트
            item.onClick(); // 해당 경로로 이동
          }}
        > 
          <div className="navItem">
            <img
              src={`/assets/탭바_${item.name}_${activeType === item.type ? "선택" : "기본"}.svg`}
              alt={item.name}
              className="navIcon"
            />

            <p>{item.name}</p>
          </div>
        </div>
      ))}
    </div>
  )

}

export default BottomNav