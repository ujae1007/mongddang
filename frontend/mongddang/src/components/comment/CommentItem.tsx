import { Comment } from "../../types";
import Button from "../common/Button";

import {format, parseISO, addHours } from "date-fns" // 날짜 형식을 변환하기 위해 import 
import { ko } from "date-fns/locale";  // 한국 시간으로 바꾸기 위해 ko를 import 해오기

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: number) => void;
}

const CommentItem = ({ comment, onDelete }:CommentItemProps) => {

  const utcDate = parseISO(comment.createdAt);
  const kstDate = addHours(utcDate, -9); // 한국 시간으로 바꾸기
  const newDate = format(kstDate, 'yyyy-MM-dd', { locale: ko }); // 한국 시간으로 바꾸기


  return (
    <>
    {/*프로필 이미지*/}
    <img 
      src={comment.profileImageURL} 
      alt="프로필" 
      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
    />

    {/* 댓글 내용*/}
    <div>

      {/* 이름과 작성일*/}
      <div>
        <div>{comment.nickname}</div>
        <div>{newDate}</div>
      </div>

      {/* 수정 삭제 버튼*/}
      <div>
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
