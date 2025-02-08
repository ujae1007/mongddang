import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ProfileEdit from "./pages/user/ProfileEdit";
import Create from "./pages/album/Create";
import ProfilePage from "./pages/user/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile/{user_id}" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
