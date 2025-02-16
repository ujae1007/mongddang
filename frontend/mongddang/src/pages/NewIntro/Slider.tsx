import { useState } from "react"
import { useSwipeable } from "react-swipeable"
import React from "react"
import SlidesData from "./SlideData"
import Slide from "./Slide"
import Pagination from "./Pagination"
import StartButton from "./StartButton"
import { motion } from "framer-motion"
import "./Intro.css"

export interface SlideType {
  image1: string
  image2: string
  image3?: string
  subtitle: string
  title: string
  description: string
  classname: string
}


const SlideWrapper:React.FC = () => {

  // 내가 현재 있는 페이지
  const  [currentIndex, setCurrentIndex] = useState(0)


  //슬라이드 구현
  const handler = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
  })

  // 오른쪽으로 이동
  const handleNext = () => {
    if (currentIndex < SlidesData.length -1 ) {
      setCurrentIndex(currentIndex + 1)
    }
  }
  // 왼쪽으로 이동
  const handlePrev =  () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // 페이지 이동
  const goToSilde = (index:number) => {
    console.log(`이동할 페이지: ${index}`)
    setCurrentIndex(index)
  }

  return (

    <div {...handler} className="slider-container">

        <div
          className="slides"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`, 
            // width: `${SlidesData.length * 100}%`, // ✅ 모든 슬라이드를 가로로 배치
            width: "390px"
          }}
        >
        {SlidesData.map((slide, index) => (
          <Slide key={index} {...slide} isActive={currentIndex === index}/>
        ))}
      </div>

      <Pagination currentIndex={currentIndex} goToSlide={goToSilde} />
      <motion.img 
        className="hand" 
        src="/assets/손.png" 
        alt="손" 
        animate={{ y: [0, -8, 0] }} // 위로 올라갔다가 다시 내려오는 애니메이션
        transition={{ 
          duration: 1,  // 애니메이션 속도
          repeat: Infinity,  // 무한 반복
          repeatType: "loop",  // 계속 반복
          ease: "easeInOut" // 부드럽게   
        }}    
      />
      <StartButton />

    </div>

  )
}

export default SlideWrapper