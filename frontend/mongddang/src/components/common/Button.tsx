interface ButtonProps {
  text: string
  type: string
  onClick?: () => void
  disabled?: boolean
}

const Button = ({text, type, onClick, disabled}:ButtonProps) => {
  return (
    <button 
      className={`Button Button_${type}`}
      onClick={onClick}
      disabled={disabled}

    >
      {text}
    </button>
  )
}

export default Button