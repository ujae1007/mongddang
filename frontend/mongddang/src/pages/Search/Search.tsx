import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import './Search.css'

interface User {
  userId: number;
  nickname: string;
  profileImageUrl: string;
}

interface Album {
  albumId: number;
  title: string;
  albumImageUrl: string;
  nickname: string;
}

function SearchPage () {

  // 검색어 값 저장 상태
  const [searchTerm, setSearchTerm] = useState<string>('')

  // 유저, 앨범 검색 결과
  const [users, setUsers] = useState<User[]>([])
  const [albums, setAlbums] = useState<Album[]>([])

  // 유저, 앨범 선택 상태 관리, 일단 처음에는 users로 설정
  const [selectedTab, setSelectedTab] = useState<"users" | "albums">('users')

  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(false)

  
  // 검색어 입력시 검색 시작

  const handleSearch = async () => {

    // 만약 검색어가 없을 때
    if (!searchTerm.trim()) {
      return
    }
    setLoading(true)

    //axios 요청
    try {
      console.log("검색 시도")
      if (selectedTab === 'users') {
        const res = await axiosInstance.get(`/search/users?nickname=${searchTerm}`)
        setUsers(res.data)
        console.log("유저 검색 성공", res.data)
      }else {
        const res = await axiosInstance.get(`/search/albums?title=${searchTerm}`)
        setAlbums(res.data)
        console.log("앨범 검색 성공", res.data)
      }
    }catch (err) {
      console.error("검색 실패", err)
    }finally {
      setLoading(false)
    }

  }

  // 만약 탭을 바꿨다면
  useEffect(() => {
    handleSearch();
  }, [selectedTab]);

  // 검색결과가 없을 때 
  const noResultsMessage = selectedTab === 'users' ? '검색된 유저가 없습니다.' : '검색된 앨범이 없습니다.'

  return (
    <div className="SearchPage">
      
      {/* 검색 */}
      <div className="SearchBar">
        <input 
          type="search" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}  
          placeholder="검색어를 입력하세요"
        />
        <button
          onClick={handleSearch}>
          검색 
        </button>
      </div>

      {/* 유저, 앨범 탭 */}
      <div>
        <button onClick={() => setSelectedTab('users')}>유저</button>
        <button onClick={() => setSelectedTab('albums')}>앨범</button>
      </div>

      {/* 검색 결과 */}
      {loading 
      ?
        (<div>로딩중...</div>)
      :
        // 유저탭일 때
        selectedTab === 'users'
        ? 
        (
          <>
          {/* 유저탭인데 검색결과가 없을 때 */}
          {users.length === 0 ? (
            <div>{noResultsMessage}</div>
          ) : (
            // 유저탭인데 검색결과가 있을 때
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {users.map((user) => (
                <div key={user.userId}>
                  <img src={user.profileImageUrl} style={{ borderRadius: '50%' }} width={100} />
                  <div>{user.nickname}</div>
                </div>
              ))}
            </div>
          )}
        </>
        ):(
          // 앨범탭일 때
          <>
          {/* 앨범탭인데 검색 결과가 없을 때 */}
          {albums.length === 0 ? (
            <div>{noResultsMessage}</div>
          ) : (
            // 앨범탭인데 검색 결과가 있을 때
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {albums.map((album) => (
                <div key={album.albumId}>
                  <img src={album.albumImageUrl} alt="album" width={100}/>
                  <div>{album.title}</div>
                  <div>{album.nickname}</div>
                </div>
              ))}
            </div>
          )}
        </>
        )
      }
    </div>
  )
  }

export default SearchPage