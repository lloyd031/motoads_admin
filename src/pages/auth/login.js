// src/components/LoginForm.js
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
        await signInWithEmailAndPassword(auth,email,password)
        const user=auth.currentUser;
        if(user){
            toast.success("Login success!",{position:'top-center'});
            window.location.href="/home";
        }
    }catch(err){
        toast.error("Login error!",{position:'top-center'});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
