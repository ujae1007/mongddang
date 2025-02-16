import { useState } from 'react';
import axiosInstance from "../../api/axiosInstance";


interface Music {
  musicId: number;
  trackName: string;
  artistName: string;
  genre: string;
  popularity: number;
}

interface SearchMusicProps {
  onSelectMusic: (music: Music) => void;
  defaultKeyword?: string;
}


function SearchMusic({ onSelectMusic, defaultKeyword = '' }: SearchMusicProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const searchMusic = async () => {
    if (!keyword.trim()) {
      // 검색어를 입력하지 않고 검색 버튼을 누른 경우
      alert('키워드를 입력해주세요!');
      return;
    }

    setIsSearching(true); // 검색 중 상태로 변경
    
    try {
      const { data } = await axiosInstance.get(`/music/autocomplete?query=${keyword}`);
      
      setMusicList(data);
      
      if (data.length === 0) {
        // DB에 존재하지 않는 키워드를 입력한 경우
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('Error searching music:', error);
      alert('음악 검색 중 오류가 발생했습니다.');
      setMusicList([]);
    } finally {
      setIsSearching(false);
    }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMusic) {
      // 음악이 선택된 상태면 댓글 생성
      onSelectMusic(selectedMusic);
    } else {
      // 음악이 선택되지 않은 상태면 검색 실행
      searchMusic();
      setShowResults(true);
    }
  };

  const handleSelectMusic = (music: Music) => {
    onSelectMusic(music);
    setKeyword(`${music.trackName} - ${music.artistName}`);  // input에 선택된 음악 표시
    setMusicList([]); // 선택 후 검색 결과 초기화
    setShowResults(false);
  };

  const handleInputClick = () => {
    if (selectedMusic) {
      // 음악이 선택된 상태에서 input 클릭 시 초기화
      setSelectedMusic(null);
      setKeyword('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClick={handleInputClick}
          placeholder="노래 제목을 입력하세요"
        />
        <button type="submit" disabled={isSearching}>
          {/* 선택된 음악이 있으면 '작성', 없으면 '검색' 버튼 표시 */}
          {selectedMusic ? '작성' : (isSearching ? '검색 중...' : '검색')}
        </button>
      </form>

      {showResults && musicList.length > 0 && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>

    {/* 모달 컨텐츠 */}
    <div style={{
      width: '80%',
      maxHeight: '80%',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0 }}>음악 검색 결과</h3>
        <button 
          onClick={() => setShowResults(false)}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
      
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        margin: 0
      }}>
        {musicList.map((music) => (
          <li
            key={music.musicId}
            onClick={() => handleSelectMusic(music)}
            style={{
              padding: '15px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}
          >
            {music.trackName} - {music.artistName}
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
    </div>
  );
}

export default SearchMusic;