import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/auth/Login'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
