import "./Popup.css"

interface PopupProps {
  isLoading: boolean; 
}

const Popup = ({ isLoading }: PopupProps) => {

  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <img src="/assets/로딩중.png" alt="로딩중" className="rotation"/>
        <p>앨범 커버 생성 중</p>
      </div>
  
    </div>
  );
};

export default Popup;