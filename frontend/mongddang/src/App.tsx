import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RecoilRoot } from "recoil";
import  RecoilNexus  from "recoil-nexus";

import { useLocation } from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ProfileEdit from "./pages/user/ProfileEdit";
import Create from "./pages/album/Create";
import ProfilePage from "./pages/user/ProfilePage";
import AlbumDetail from "./pages/albumDetail/AlbumDetail";
import MainPage from "./pages/user/MainPage/MainPage";
import SearchPage from "./pages/Search/Search";
import IntroPages from "./pages/introduce/Introduce";
import FollowPage from "./pages/user/FollowPage";
import LikeAlbumsPage from "./pages/user/LikesAlbum";
import ErrorPage from "./pages/Error";

import BottomNav from "./components/common/BottomNav";

function App() {
  // 특정 페이지에서 하단 네비게이션을 숨기기 위해 AppContent로 분리해서 사용 
  return (
    <RecoilRoot>
      <RecoilNexus />
      <Router>
        <AppContent />
      </Router>
    </RecoilRoot>
  )
}

function AppContent() {

  const location = useLocation();

  const hideBottomNav = ["/", "/login", "/signup"]; // 하단 네비게이션 숨길 페이지
  const showBottomNav = !hideBottomNav.includes(location.pathname); 

  return (

    <>
      <Routes>
          <Route path="/" element={<IntroPages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/likes" element={<LikeAlbumsPage />} />
          
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profileEdit" element={<ProfileEdit />} />
          <Route path="/follow" element={<FollowPage />} />

          <Route path="/create" element={<Create />} />
          <Route path="/albums/:albumId" element={<AlbumDetail />} />
          
          <Route path="*" element={<ErrorPage />} />
        </Routes>
          {showBottomNav && <BottomNav/>}
    </>
  );
}

export default App;
