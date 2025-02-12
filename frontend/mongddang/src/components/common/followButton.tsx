interface FollowButtonProps {
  text: string;
  onClick?: () => void
}

const FollowButton = ({text, onClick} :FollowButtonProps) => {
  return (
    <button
      onClick={onClick}>
      {text}
    </button>
  )
}

export default FollowButton