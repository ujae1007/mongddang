import React from "react"
import { SlideType } from "./Slider"
import { motion } from "framer-motion"

// 애니메이션 효과 적용하기 
interface SlideProps extends SlideType {
  isActive:boolean; 
}

const Slide:React.FC<SlideProps> = ({image1, image2, image3, subtitle, title, description, classname, isActive}) => {
  return (
    <div className={`slide slide_${classname}`}>
      <motion.img 
        src={image1} 
        className={`image image1_${classname}`}
        initial={{ scale: 0.7, opacity: 0.5}}
        animate={{ scale: isActive? 1: 0.5, opacity: isActive? 1: 0.5}}
        transition={{duration:1, ease: "easeInOut"}}
      />
      <motion.img 
        src={image2} 
        className={`image image2_${classname}`}
        initial={{ scale: 0.5, opacity: 0.5}}
        animate={{ scale: isActive? 1: 0.5, opacity: isActive? 1: 0.5}}
        transition={{duration:1, ease: "easeInOut"}}
      />
      {image3 && 
        <motion.img 
          src={image3} 
          className={`image image3_${classname}`}
          initial={{ scale: 0.8, opacity: 0.5}}
          animate={{ scale: isActive? 1: 0.5, opacity: isActive? 1: 0.5}}
          transition={{duration:1, ease: "easeInOut"}}
        />}

      {/* 지금 position relative  */}
      <div className="text"> 

        <motion.p 
          className={`subtitle subtitle_${classname}`}
          initial={{ scale: 0.7, opacity: 0.2, y: 200 }} // 처음에는 작고, 아래에서 올라오는 효과
          animate={{ 
            scale: isActive ? 1 : 0.7, 
            opacity: isActive ? 1 : 0.2, 
            y: isActive ? 0 : 50}} // 현재 페이지면 원래 위치, 아니면 아래로 이동
            transition={{ duration: 1, ease: "easeInOut" }}
        >{subtitle}</motion.p>

        <motion.p 
          className={`title title_${classname}`}
          initial={{ scale: 0.8, opacity: 0.2, y: 200 }} 
          animate={{ 
            scale: isActive ? 1 : 0.5, 
            opacity: isActive ? 1 : 0.2, 
            y: isActive ? 0 : 50}} 
            transition={{ duration: 1, ease: "easeInOut" }}
        >{title}</motion.p>


        <motion.p 
          initial={{ scale: 0.5, opacity: 0.2, y: 200 }} 
          animate={{ 
            scale: isActive ? 1 : 0.5, 
            opacity: isActive ? 1 : 0.2, 
            y: isActive ? 0 : 50}} 
            transition={{ duration: 1.3, ease: "easeInOut" }}
          className={`description description_${classname}`}dangerouslySetInnerHTML={{ __html: description }}></motion.p>
      </div>
    </div>
  )
}

export default Slide