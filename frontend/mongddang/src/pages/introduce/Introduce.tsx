//모든 5개 슬라이드 import 해오는 페이지
import React, { useState, useRef, TouchEvent } from "react"
import {useNavigate } from "react-router-dom";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
import PageThree from "./PageThree";
import PageFour from "./PageFour";
import PageFive from "./PageFive";


import {
  Container,
  SlideContainer,
  Navigation,
  Indicators,
  Dot,
  StartButton,
} from './Common.ts';

const IntroPages = () => {

  const nav = useNavigate()

  const [currentPage, setCurrentPage] = useState(0) //현재 슬라이드 번호
  const [touchStart, setTouchStart] = useState(0) //터치가 시작된 위치
  const [touchEnd, setTouchEnd] = useState(0) //터치가 끝난 위치
  const containerRef = useRef<HTMLDivElement>(null) // 슬라이드 컨테이너의 DOM요소 참조용 

  //각 페이지 컴포넌트들을 배열로 관리
  const pageComponents = [
    <PageOne key={1} />,
    <PageTwo key={2} />,
    <PageThree key={3} />,
    <PageFour key={4} />,
    <PageFive key={5} />,
  ]
  
  // 손가락 터치 시작 시 호출
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX) //터치가 시작된 X 좌표 저장
    setTouchEnd(e.touches[0].clientX) // 초기값 설정?? 
  }

  // 손가락을 화면에서 움직일 때 
  const handleTouchMove = (e:TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientX) //터치가 이동한 X좌표 저장
  }

  // 손가락을 떼었을 때 호출하는 함수 
    const handleTouchEnd = () => {
      const minSwipeDistance = 50 // 최소한 50 움직여야 스와이프 발생
      const diff = touchStart - touchEnd // 터치 시작과 끝난 위치의 차이

      //50보다 더 많이 움직였을 때
      if(Math.abs(diff) > minSwipeDistance) {
        // 오른쪽으로 움직였고, 현재 페이지가 마지막 페이지가 아닐경우 
        if(diff > 0 && currentPage < pageComponents.length -1 ) {
          handlePageChange(currentPage + 1)
        }
        //왼쪽으로 움직였고, 현재페이지가 첫 페이지가 아닐경우      
        if(diff < 0 && currentPage > 0) {
          handlePageChange(currentPage - 1)
        }
      }
    }

    // 페이지 변경함수, 스크롤 애니메이션 (아래 동그라미 버튼 클릭하면)
    const handlePageChange = (index: number) => {
      setCurrentPage(index) // 현재 위치 업데이트
      //슬라이드 컨테이너가 화면에 존재한다면 특정 위치로 스크롤을 이동 
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: window.innerWidth * index, // 현재 화면 크기만큼 스크롤 이동
          behavior: 'smooth' // 부드럽게 스크롤 추가
        })
      }
    }

    // 사용자가 직접 스크롤할 때 페이지 번호 변경
    const handleScroll = (e:React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget // 지금 사용자가 스크롤한 슬라이드 전체(div)
      // Math.round(반올림해서 정확한 페이지로 계산하겠다.)
      // container.scrollLeft (현재 스크롤된 위치)
      // window.innerWidth (한 화면의 너비)
      const newPage = Math.round(container.scrollLeft / window.innerWidth)
      if(newPage! == currentPage){
        setCurrentPage(newPage)
      }
    }

    // 시작하기 버튼을 눌렀을 때 실행할 함수
    const handleStart = () => {
      nav('/login')
    }


  return (
    <Container> 

      {/*텍스트와 이미지들*/}
      <SlideContainer
        ref={containerRef}
        onScroll={handleScroll}  
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pageComponents}
      </SlideContainer>


      {/* 하단 버튼들 */}
      <Navigation >

        {/* 점 모음들 */}
        <Indicators> 
          {pageComponents.map((_, index) => (
            <Dot
              key={index}
              active={currentPage === index}
              onClick={() => handlePageChange(index)} 
            />
          ))}

        </Indicators>
        <StartButton onClick={handleStart}>
          시작하기
        </StartButton>

      </Navigation>


    </Container>
  )
}

export default IntroPages