interface ButtonProps {
  text: string
  type: string
  buttonType?: "button" | "submit" | "reset" // HTML 기본 type
  onClick?: () => void
  disabled?: boolean
}

const Button = ({text, type, buttonType="button", onClick, disabled}:ButtonProps) => {
  return (
    <button 
      className={`Button Button_${type}`}
      type={buttonType}
      onClick={onClick}
      disabled={disabled}

    >
      {text}
    </button>
  )
}

export default Button