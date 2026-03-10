import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-8">
      
      {/* Logo Section */}
      <div className="flex-1">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white group-hover:bg-indigo-500 transition-colors">
            DT
          </div>
          <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
            dev<span className="text-indigo-500">Tinder</span>
          </span>
        </Link>
      </div>

      {/* User Section */}
      {user && (
        <div className="flex items-center gap-6">
          
          {/* Desktop Links - Quick Access */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link to="/" className={`hover:text-white transition ${isActive('/') ? 'text-indigo-400' : ''}`}>Feed</Link>
            <Link to="/connections" className={`hover:text-white transition ${isActive('/connections') ? 'text-indigo-400' : ''}`}>Connections</Link>
            <Link to="/requests" className={`hover:text-white transition ${isActive('/requests') ? 'text-indigo-400' : ''}`}>Requests</Link>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 hidden md:block"></div>

          <div className="dropdown dropdown-end">
            {/* Avatar Button */}
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:bg-slate-800 transition-all">
              <div className="w-10 rounded-xl ring-2 ring-indigo-500/30 hover:ring-indigo-500 transition-all">
                <img
                  alt="User"
                  src={user.photoURL || "https://ui-avatars.com/api/?name=" + user.firstName}
                />
              </div>
            </label>

            {/* Professional Dropdown Menu */}
            <ul
              tabIndex={0}
              className="mt-4 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-slate-900 border border-slate-800 rounded-2xl w-60 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-800 mb-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Account</p>
                <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              </div>

              <li>
                <Link to="/profile" className="py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition flex items-center gap-3">
                  <span>Profile</span>
                </Link>
              </li>
              
              <li className="md:hidden">
                <Link to="/connections" className="py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition">
                  Connections
                </Link>
              </li>

              <li className="md:hidden border-b border-slate-800 pb-2 mb-2">
                <Link to="/requests" className="py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition">
                  Requests
                </Link>
              </li>

              <li className="mt-1">
                <button
                  onClick={handleLogout}
                  className="py-3 px-4 text-red-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition w-full text-left font-medium"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default NavBar;