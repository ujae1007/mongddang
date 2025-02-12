import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RecoilRoot } from "recoil";
import  RecoilNexus  from "recoil-nexus";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ProfileEdit from "./pages/user/ProfileEdit";
import Create from "./pages/album/Create";
import ProfilePage from "./pages/user/ProfilePage";
import AlbumDetail from "./pages/albumDetail/AlbumDetail";
import MainPage from "./pages/user/MainPage";
import IntroPages from "./pages/introduce/Introduce";

//이거 유튜브 확인용 나중에 삭제 예정!!!!
import YoutubePractice from "./pages/youtube/youtubePrac";

function App() {
  return (

    <RecoilRoot> 
      <RecoilNexus />
      <Router>
        <Routes>
          <Route path="/MONGDDANG" element={<IntroPages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/profileEdit" element={<ProfileEdit />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/youtube" element={<YoutubePractice />} />
          <Route path="/albums/:albumId" element={<AlbumDetail />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
