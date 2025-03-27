// src/components/SignupForm.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth,db } from "../../firebase";
import { setDoc,doc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError(""); // Clear error message
    try{
        await createUserWithEmailAndPassword(auth,email,password);
        const user=auth.currentUser;
        if(user){
         await setDoc(doc(db,"user",user.uid),{
             email:user.email,
             fn:fname,
             ln:lname,
         });
        }
        toast.success("Success!",{position:"top-center"})
     }catch(err){
         toast.error("Invalid details",{position:"top-center"})
     }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="fname" className="block text-sm font-medium text-gray-700">Firs Name</label>
            <input
              type="text"
              id="fname"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your first name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lname"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your last name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
