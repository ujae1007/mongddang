import { Comment } from "../../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onDelete?: (id: number) => void;
}

const CommentList = ({ comments, onDelete }: CommentListProps) => {

  const commentArray = Array.isArray(comments) ? comments : []; // 댓글이 없을 경우 빈 배열로 처리 

  return (
    <div>
      {commentArray.length === 0 ? (
        <div>아직 작성된 댓글이 없습니다.</div>
      ) : (
        commentArray.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;