import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ProfileEdit from "./pages/user/ProfileEdit";
import Create from "./pages/album/Create";
import ProfilePage from "./pages/user/ProfilePage";
import AlbumDetail from "./pages/albumDetail/AlbumDetail";


//이거 유튜브 확인용 나중에 삭제 예정!!!!
import YoutubePractice from "./pages/youtube/youtubePrac";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile/:user_id" element={<ProfilePage />} />
        <Route path="/youtube" element={<YoutubePractice />} />
        <Route path="/albums/:albumId" element={<AlbumDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
