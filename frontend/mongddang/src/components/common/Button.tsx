import "./Button.css"

interface ButtonProps {
  text: string
  using?: "Album" | "Album2"
  type?: "Large" | "Middium" | "ProfileEdit" | "PopUp" | "confirm | edit | delete"
  onClick?: () => void
  disabled?: boolean
}

const Button = ({text, using, type, onClick, disabled}:ButtonProps) => {
  return (
    <button 
      className={`Button Button_${type} Button_${using} Button_${using}_${type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button