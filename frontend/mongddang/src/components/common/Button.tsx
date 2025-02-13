import "./Button.css"

interface ButtonProps {
  text: string
  using?: " "
  type: "Large" | "Middium" | "ProfileEdit" | "PopUp" | "confirm"
  onClick?: () => void
  disabled?: boolean
}

const Button = ({text, using, type, onClick, disabled}:ButtonProps) => {
  return (
    <button 
      className={`Button Button_${type} Button_${using}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button