import './input.css'
interface InputBoxProps {
  type: "password" | "default" | "search"
  mode: "login" |"signup" | "edit" 
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: string
  value: string
}



const InputBox = ({type, mode, placeholder, onChange, defaultValue, value}: InputBoxProps) => {
  return (
    <input 
      className={`input input_${type}`} 
      type={type === "password" ? "password" : "text"} 
      placeholder={mode === "signup" || mode === "login"? placeholder : undefined} 
      onChange={onChange} 
      value={value !== undefined ? value : defaultValue}
    />
  )
}

export default InputBox