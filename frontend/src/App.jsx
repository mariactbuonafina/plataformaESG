import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/Components/Login/Login';
import TelaInicio from './TelaInicio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<TelaInicio />} />
      </Routes>
    </Router>
  );
}

export default App;
