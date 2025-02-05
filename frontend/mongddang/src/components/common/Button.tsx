interface ButtonProps {
  text: string
  type: string
  // ? : 선택적 속성으로 onClick을 전달하지 않아도 오류 발생 없음. 매개변수가 없는 함수는 반환값이 없도록
  onClick?: () => void
}

const Button = ({text, type, onClick}: ButtonProps) => {
  return (
    <button onClick={onClick} className={`Button Button_${type}`}>{text}</button>
  )
}

export default Button