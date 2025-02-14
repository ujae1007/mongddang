interface FollowButtonProps {
  text: string;
  type?: "Following" | "Follow" 
  onClick?: () => void
}
import './followButton.css'

const FollowButton = ({text, type, onClick} :FollowButtonProps) => {
  return (
    <button
      className= {`FollowButton FollowButton_${type}`}
      onClick={onClick}>
      {text}
    </button>
  )
}

export default FollowButton