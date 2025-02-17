import './input.css'
interface InputBoxProps {
  type: "password" | "default"
  mode: "login" |"signup" | "edit" 
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: string
  value: string
  onKeyDown? : (e: React.KeyboardEvent<HTMLInputElement>) => void
}



const InputBox = ({type, mode, placeholder, onChange, defaultValue, value, onKeyDown}: InputBoxProps) => {
  return (
    <input 
      className={`input input_${type}`} 
      type={type === "password" ? "password" : "text"} 
      placeholder={mode === "signup" || mode === "login"? placeholder : undefined} 
      onChange={onChange} 
      onKeyDown={onKeyDown} 
      value={value !== undefined ? value : defaultValue}
    />
  )
}

export default InputBox