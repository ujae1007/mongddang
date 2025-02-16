import React from 'react';
import SlidesData from './SlideData';
import "./Intro.css"

interface PaginatoinProps {
  currentIndex: number
  goToSlide:(index: number) => void
}

const Pagination: React.FC<PaginatoinProps> = ({ currentIndex, goToSlide }) => {

  return (
    <div className="pagination">
      {SlidesData.map((_, index) =>(
        <button 
          key={index} 
          className={`dot dot_${index === currentIndex ? 'active' : ""}`}
          onClick={() => goToSlide(index)} />
      ))}
    </div>

  )
}

export default Pagination