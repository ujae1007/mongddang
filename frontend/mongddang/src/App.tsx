import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import ProfileEdit from './pages/user/ProfileEdit'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
      </Routes>
    </Router>
  )
}

export default App
