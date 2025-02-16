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
  onCommentCreated?: () => void;  // 댓글 생성 후 호출
}

const CreateComment = ({ albumId, userProfileImage, onCommentCreated }: CreateCommentProps) => {
  // 선택된 음악 정보를 저장
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  // 댓글 생성 API 호출
  const createComment = async () => {
    if (!selectedMusic) return;

    try {
      const content = `${selectedMusic.trackName} - ${selectedMusic.artistName}`;
      await axiosInstance.post(`/api/comment/${albumId}`, {
        content: content
      });
      
      // 댓글 생성 성공 후 처리
      setSelectedMusic(null);  // 선택된 음악 초기화
      onCommentCreated?.();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // 음악 선택 시 자동으로 댓글 생성
  const handleMusicSelect = async (music: Music) => {
    setSelectedMusic(music);
    await createComment();
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