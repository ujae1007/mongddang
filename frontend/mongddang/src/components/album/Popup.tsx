import "./Popup.css"

interface PopupProps {
  isLoading: boolean; 
}

const Popup = ({ isLoading }: PopupProps) => {

  return (
    <div>
      <div>
        <img src="/assets/로딩중.png" alt="로딩중" />
        <p>앨범 커버 생성 중</p>
      </div>
  
    </div>
  );
};

export default Popup;