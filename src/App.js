
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import LoginForm from './pages/auth/login';
import SignupForm from './pages/auth/signup';
import { ToastContainer } from 'react-toastify';
import { useEffect,useState } from 'react';
import { auth } from './firebase';
import Navbar from './pages/components/navbar';
import Map from './pages/googlemap';

export function App() {
  const [user, setUser]=useState(null);
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setUser(user);
    });
  });
  return (
    
      <Router>
        <div className='flex-col w-full'>
        <Navbar user={user} setUser={setUser} />
            <Routes>
            <Route path="/" element={user ? <Navigate to={"/home"}/>:<LoginForm/>}/>
            <Route path="/signup" element={user ? <Navigate to={"/home"}/>:<SignupForm/>}/>
            <Route path="/home" element={user==null ? <Navigate to={"/"}/>:<Map/>}/>
            </Routes>
            <ToastContainer/>
         
        </div>
      </Router>
  )
}

export default App