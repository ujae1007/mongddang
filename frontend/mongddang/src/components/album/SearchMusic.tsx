import { useState } from 'react';

interface SearchMusicProps {
  onSelectMusic: (music: string) => void;
  defaultKeyword?: string;
}


function SearchMusic({ onSelectMusic, defaultKeyword = '' }: SearchMusicProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [musicList, setMusicList] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMusic = async () => {
    if (!keyword.trim()) {
      // 검색어를 입력하지 않고 검색 버튼을 누른 경우
      alert('키워드를 입력해주세요!');
      return;
    }

    setIsSearching(true); // 검색 중 상태로 변경

  // 실제 서버 API 호출 코드
  //   try {
  //     const response = await fetch(`api/music/autocomplete?query=${encodeURIComponent(keyword)}`);
  //     if (!response.ok) {
  //       throw new Error('검색에 실패했습니다.');
  //     }

  //     const data = await response.json();
  //     setMusicList(data);
  //     if (data.length === 0) { 
  //     // DB에 존재하지 않는 키워드를 입력한 경우 
  //       alert('검색 결과가 없습니다.');}


  //   } catch (error) {
  //     console.error('Error searching music:', error);
  //     alert('음악 검색 중 오류가 발생했습니다.');
  //     setMusicList([]);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  // 확인용
  // 테스트용 mock 데이터
  const mockMusicDatabase = [
    "신호등 - 이무진",
    "사건의 지평선 - 윤하",
    "Ditto - NewJeans",
    "LOVE DIVE - IVE",
    "Hype Boy - NewJeans",
    "After LIKE - IVE",
    "새삥 - ZICO",
    "Cookie - NewJeans",
    "자격지심 - BE'O",
    "FEARLESS - LE SSERAFIM"
  ];

   // API 호출을 시뮬레이션
   try {
    // 실제 API 호출 대신 mock 데이터 필터링
    const filteredMusic = mockMusicDatabase.filter(music => 
      music.toLowerCase().includes(keyword.toLowerCase())
    );

    // API 호출 시뮬레이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setMusicList(filteredMusic);
    
    if (filteredMusic.length === 0) {
      // DB에 존재하지 않는 키워드를 입력한 경우
      // 존재하지 않는 음악을 검색한 경우
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
    searchMusic();
  };

  const handleSelectMusic = (music: string) => {
    onSelectMusic(music);
    setMusicList([]); // 선택 후 검색 결과 초기화
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="노래 제목을 입력하세요"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? '검색 중...' : '검색'}
        </button>
      </form>

      {musicList.length > 0 && (
        <ul>
          {musicList.map((music, index) => (
            <li
              key={index}
              onClick={() => handleSelectMusic(music)}
              style={{ cursor: 'pointer' }}
            >
              {music}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchMusic;