import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";
import { Comment as CommentType } from "../../types";

interface CommentProps {
  albumId: number;
  userProfileImage: string;  // 현재 로그인한 사용자의 프로필 이미지
}

const Comment = ({ albumId, userProfileImage }: CommentProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);


  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const { data } = await axiosInstance.get(`/comment/${albumId}`);
      console.log('댓글 목록 조회 결과:', data);
      setComments(data);
    } catch (error) {
      console.error('댓글 조회 중 오류 발생:', error);
    }
  };

  // 컴포넌트 마운트 시 댓글 목록 조회
  useEffect(() => {
    fetchComments();
  }, [albumId]);

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    try {
      await axiosInstance.delete(`/comment/${commentId}`);
      fetchComments();  // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <CreateComment 
        albumId={albumId}
        userProfileImage={userProfileImage}
        onCommentCreated={fetchComments}
      />
      <CommentList
        comments={comments}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Comment;