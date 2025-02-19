import { useState } from 'react';
import axiosInstance from "../../api/axiosInstance";

import './AlbumMusicComment.css';


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


function AlbumMusicComment({ onSelectMusic, defaultKeyword = '' }: SearchMusicProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const[isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열기/닫기

  const SearchMusicComment = async () => {
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
    SearchMusicComment();
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
    <div >
      <div className='comment-music-search'>
        <button onClick={handleOpenModal} className='comment-music-search-btn' > 
          <div className='comment-music-search-text'>
            <div> 음악을 검색하고 취향을 공유해 보세요! </div>
          </div>
        </button>
      </div>

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
                  onClick={() => SearchMusicComment()}
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

export default AlbumMusicComment;