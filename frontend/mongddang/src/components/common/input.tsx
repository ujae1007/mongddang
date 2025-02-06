interface InputBoxProps {
  type: "text" | "password" | "default";
  placeholder: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}



const InputBox = ({type, placeholder, onChange, value}: InputBoxProps) => {
  return (
    <input 
      className={`input input_${type}`} 
      type={type} 
      placeholder={placeholder} 
      onChange={onChange ? (e) => onChange(e) : undefined} 
      value={value}
    />
  )
}

export default InputBox