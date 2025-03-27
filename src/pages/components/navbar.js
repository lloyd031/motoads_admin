// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    auth.signOut(); // Clear user state
    navigate('/'); // Redirect to home page (login page)
  };

  return (
    <nav className="bg-red-500 p-4 ">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link to="/">FAST Ads</Link>
        </div>

        {/* Menu for larger screens */}
        <div className="hidden md:flex space-x-4">
          <Link to="/home" className="text-white hover:bg-red-600 px-3 py-2 rounded-md">
            Home
          </Link>
          

          {/* Show Signup and Login if not logged in */}
          {!user ? (
            <>
              <Link to="/signup" className="text-white hover:bg-red-600 px-3 py-2 rounded-md">
                Signup
              </Link>
              <Link to="/" className="text-white hover:bg-red-600 px-3 py-2 rounded-md">
                Login
              </Link>
            </>
          ) : (
            <>
              {/* Show Logout when user is logged in */}
              <button
                onClick={handleLogout}
                className="text-white hover:bg-red-600 px-3 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
