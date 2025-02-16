import { Comment } from "../../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onEdit?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
}

const CommentList = ({ comments, onEdit, onDelete }: CommentListProps) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;