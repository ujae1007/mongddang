import './Modal.css'

interface ModalProps {
  isOpen: boolean; // 모달 열림 여부

  title: string; // 제목
  content: string; // 내용

  cancelText?: string; // 취소 버튼 텍스트
  confirmText? : string; // 확인 버튼 텍스트

  onCancel: () => void; // 취소 버튼 클릭 시 실행할 함수
  onConfirm: () => void;  // 확인 버튼 클릭 시 실행할 함수
}

const Modal = ({ isOpen, title, content, cancelText, confirmText, onCancel, onConfirm }: ModalProps) => {
  return (
    <div className={`Modal ${isOpen ? 'Modal-Open' : ''}`}>
      <div className="Modal-Content">
        <h2>{title}</h2>
        <p>{content}</p>
        <div className="Modal-Buttons">
          <button className="Modal-Button Modal-Button-Cancel" onClick={onCancel}>{cancelText || '취소'}</button>
          <button className="Modal-Button Modal-Button-Confirm" onClick={onConfirm}>{confirmText || '확인'}</button>
        </div>
      </div>
    </div>
  )
}
export default Modal