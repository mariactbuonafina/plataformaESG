import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './assets/Components/Login/Login'
import Home from './assets/Components/Home/Home'

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
