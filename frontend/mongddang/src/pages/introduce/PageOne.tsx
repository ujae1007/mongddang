import {Wrap, SlideImage1, SlideImage2, SlideImage3, SlideTitle, SlideSubTitle, SlideDescription} from "./PageOneStyle"

const PageOne = () => {

  const image1 = "/assets/레코드판.png"
  const image2 = "/assets/mp3.png"
  const image3 = "/assets/파란색카메라.png"

  return (
    <Wrap>
      <SlideImage1 src={image1} alt="이미지1" />
      <SlideImage2 src={image2} alt="이미지2" />
      <SlideImage3 src={image3} alt="이미지3" />
      <SlideSubTitle>노래와 함께하는 </SlideSubTitle>
      <SlideTitle>추억 여행 서비스</SlideTitle>
      <SlideDescription>몽땅은 그 순간의 감정과 분위기를 담은 노래를 함께 제공하여 더욱 풍성한 경험을 선사합니다.</SlideDescription>
    </Wrap>
  )
}

export default PageOne