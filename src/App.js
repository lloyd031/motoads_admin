
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import MapWrapper from './pages/googlemap';

export function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/maps" element={<MapWrapper/>}/>
        </Routes>
    </Router>
  )
}

export default App