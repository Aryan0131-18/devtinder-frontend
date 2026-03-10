import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 1. Add state for visibility
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    const endpoint = isLoginForm ? "/login" : "/signup";
    const payload = isLoginForm 
      ? { emailId, password } 
      : { firstName, lastName, emailId, password };

    try {
      const res = await axios.post(BASE_URL + endpoint, payload, { withCredentials: true });
      dispatch(addUser(isLoginForm ? res.data : res.data.data));
      navigate(isLoginForm ? "/" : "/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] px-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {isLoginForm ? "Welcome Back" : "Join the Tribe"}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {isLoginForm ? "Login to connect with developers" : "Create your professional developer profile"}
          </p>
        </div>

        <div className="space-y-5">
          {!isLoginForm && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={firstName}
                placeholder="First Name"
                className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                value={lastName}
                placeholder="Last Name"
                className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}

          <input
            type="email"
            value={emailId}
            placeholder="Email Address"
            className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
            onChange={(e) => setEmailId(e.target.value)}
          />

          {/* 2. Wrap password input and add toggle button */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500 pr-12"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-tighter"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-lg p-3 mt-4 text-center">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3 rounded-xl mt-8 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAuth}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            isLoginForm ? "Sign In" : "Create Account"
          )}
        </button>

        <div className="mt-8 text-center">
          <button
            className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
            onClick={() => {
                setIsLoginForm((v) => !v);
                setError("");
                setShowPassword(false); 
            }}
          >
            {isLoginForm ? (
              <>New to devTinder? <span className="text-indigo-500 font-semibold underline underline-offset-4">Create an account</span></>
            ) : (
              <>Already a member? <span className="text-indigo-500 font-semibold underline underline-offset-4">Log in</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;