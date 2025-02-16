import { Comment } from "../../types";
import Button from "../common/Button";

interface CommentItemProps {
  comment: Comment;
  onEdit?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
}

const CommentItem = ({ comment, onEdit, onDelete }:CommentItemProps) => {

  return (
    <>
    {/*프로필 이미지*/}
    <img src={comment.profileImageURL} alt="프로필" />

    {/* 댓글 내용*/}
    <div>

      {/* 이름과 작성일*/}
      <div>
        <div>{comment.nickname}</div>
        <div>{comment.date}</div>
      </div>

      {/* 수정 삭제 버튼*/}
      <div>
        <Button
          text="수정"
          type="edit"
          onClick={() => onEdit?.(comment.commentId, comment.content)}
        />
        <Button
          text="삭제"
          type="delete"
          onClick={() => onDelete?.(comment.commentId)}
        />
      </div>
      
      {/* 댓글 내용*/}
      <div>{comment.content}</div>
    </div>
    </>
  );
}

export default CommentItem;
