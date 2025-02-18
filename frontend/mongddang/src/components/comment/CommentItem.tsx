import { Comment } from "../../types";
import { useEffect, useState } from 'react';
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth"

import {format, parseISO, addHours } from "date-fns" // 날짜 형식을 변환하기 위해 import 
import { ko } from "date-fns/locale";  // 한국 시간으로 바꾸기 위해 ko를 import 해오기

import './CommentItem.css';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: number) => void;
}

const CommentItem = ({ comment, onDelete }:CommentItemProps) => {

  const utcDate = parseISO(comment.createdAt);
  const kstDate = addHours(utcDate, -9); // 한국 시간과의 시간 차이 적용
  const newDate = format(kstDate, 'yyyy-MM-dd', { locale: ko }); // 한국 시간으로 바꾸기

  // 현재 로그인한 사용자 정보
  const loggedInUser = useAuth();
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  useEffect(() => {
    if (loggedInUser) {
      setLoggedInUserId(loggedInUser.userId);
    }
  }, [loggedInUser]);


  return (
    <>

    {/* 댓글 내용*/}
    <div className="CommentItem">

      {/*프로필 이미지*/}
      <img
        className="profile" 
        src={comment.profileImageURL} 
        alt="프로필" 
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />

      <div className="CommentContentContainer">
        <div className="CommentInfo">
            {/* 이름과 작성일*/}
          <div className="CommentInfoText">
            <div>{comment.nickname}</div>
            <div className="CommentInfoDate">{newDate}</div>
          </div>

          {/* 삭제 버튼*/}
          {loggedInUserId === comment.userId &&(
            <div className="CommentDeleteBtn">
              <Button
                text="삭제"
                type="delete"
                onClick={() => onDelete?.(comment.commentId)}
              />
            </div>

          )}
        </div>
        {/* 댓글 내용*/}
        <div className="CommentContent">
          <img src="/assets/음표2.svg" alt="" />
          <div className="CommentMusic"> {comment.content} </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default CommentItem;
