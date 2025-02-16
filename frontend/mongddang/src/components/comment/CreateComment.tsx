import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import SearchMusic from "../album/SearchMusic";

// 음악 검색 결과 타입
interface Music {
  musicId: number;
  trackName: string;
  artistName: string;
  genre: string;
  popularity: number;
}

interface CreateCommentProps {
  albumId: number;  // URL의 album_id
  userProfileImage: string;  // 현재 로그인한 사용자의 프로필 이미지
  onCommentCreated?: () => void;  // 댓글 생성 후 호출될 함수
}

const CreateComment = ({ albumId, userProfileImage, onCommentCreated }: CreateCommentProps) => {
 
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);  // 선택된 음악 정보를 저장

  /// 음악 선택 시 호출
  const handleMusicSelect = async (music: Music) => {
    try {
      // 음악 정보로 댓글 생성
      const content = `${music.trackName} - ${music.artistName}`;
      await axiosInstance.post(`/comment/${albumId}`, {
        content: content
      });
      
      // 댓글 생성 성공 후 처리
      setSelectedMusic(null);  // 선택된 음악 초기화
      onCommentCreated?.();    // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
    }
  };

  return (
    <div>
      {/* 프로필 이미지 */}
      <img 
        src={userProfileImage} 
        alt="profile" 
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
      
      {/* 음악 검색 */}
      <SearchMusic onSelectMusic={handleMusicSelect} />
    </div>
  );
};

export default CreateComment;