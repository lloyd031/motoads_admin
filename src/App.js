
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import MapWrapper from './pages/googlemap';
import LoginForm from './pages/auth/login';
import SignupForm from './pages/auth/signup';
import { ToastContainer } from 'react-toastify';
import { useEffect,useState } from 'react';
import { auth } from './firebase';
import Navbar from './pages/components/navbar';

export function App() {
  const [user, setUser]=useState(null);
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setUser(user);
    });
  });
  return (
    
    <Router>
      <Navbar user={user} setUser={setUser} />
        <Routes>
        <Route path="/" element={user ? <Navigate to={"/home"}/>:<LoginForm/>}/>
        <Route path="/home" element={!user ? <Navigate to={"/"}/>:<Home/>}/>
        <Route path="/signup" element={<SignupForm/>}/>
        <Route path="/maps" element={!user ? <Navigate to={"/"}/>:<MapWrapper/>}/>
        </Routes>
        <ToastContainer/>
    </Router>
  )
}

export default App