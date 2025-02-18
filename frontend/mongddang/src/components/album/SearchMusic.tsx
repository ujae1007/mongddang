import { useState } from 'react';
import axiosInstance from "../../api/axiosInstance";

import './SearchMusic.css';


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
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const[isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열기/닫기

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
      searchMusic();
    }


  const handleSelectMusic = (music: Music) => {
    onSelectMusic(music);
    setSelectedMusic(music);
    setKeyword(`${music.trackName} - ${music.artistName}`);  // input에 선택된 음악 표시
    setMusicList([]); // 선택 후 검색 결과 초기화
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedMusic(null);
    setKeyword('');
  };


  return (
    <div>
      <div>
        <button onClick={handleOpenModal} className='album-music-search-btn' > 
          <div className="album-music-search-text">
            <img src="/assets/음표.svg" alt="" style={{width:"18px"}}/>
            <div> 노래 추가 </div>
          </div>
          <img src="/assets/화살표.svg" alt="" />
        </button>
      </div>

      {/* 선택된 음악 표시 */}
      {/* {selectedMusic && (
        <div stylle>
          <p>{selectedMusic.trackName} - {selectedMusic.artistName}</p>
        </div>
      )} */}

      {isModalOpen && ( 
        <div className='MusicSearchModal'>
          <div className='MusicSearchModalContent'>
            {/* 창닫기 버튼 */}
            <div className='MusicSearchCloseBtn'>
              <img src="/assets/창닫기.svg" alt="" onClick={() => setIsModalOpen(false)} />
            </div>

            {/* 검색 폼 부분*/}
            <form onSubmit={handleSubmit}>
              <div className='MusicSearchForm'>
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="노래 제목을 입력하세요"
                  className='MusicSearchInput'
                />

                <img 
                  src="/assets/검색2.svg" 
                  alt="" 
                  onClick={() => searchMusic()}
                  className='MusicSearchIcon'
                />
              </div>
            </form>

            {/* 검색 결과 리스트*/}
            {musicList.length > 0 && (
              <ul className='MusicSearchList'>
                {musicList.map((music) => (
                  <div className='MusicSearchItemResult'>
                    <img src="/assets/음표3.svg" alt="" />
                    <div
                      key={music.musicId} 
                      onClick={() => handleSelectMusic(music)}>
                      <div className='MusicSearchResultMusic'> {music.trackName} </div>
                      <div className='MusicSearchResultArtist'> {music.artistName} </div>
                    </div>
                  </div>
                ))}
              </ul>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default SearchMusic;