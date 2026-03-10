import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import axios from 'axios';

// Add showButtons prop with a default value of true
const UserCard = ({ user, showButtons = true }) => {
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, age, about, gender, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request failed", err);
    }
  };

  return (
    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
      
      <div className="relative h-96 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={photoUrl || "https://geographyandyou.com/images/user-profile.png"}
          alt={`${firstName}'s profile`}
          onError={(e) => {
            e.target.src = "https://ui-avatars.com/api/?name=" + firstName + "&background=6366f1&color=fff";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
        
        <div className="absolute bottom-4 left-6 flex gap-2">
          {age && (
          <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
          {age} yrs
          </span>
          )}
          <span className="bg-indigo-600/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/50 capitalize">
            {gender}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {firstName} {lastName}
        </h2>

        <p className="text-slate-400 text-sm mt-2 leading-relaxed italic line-clamp-2 h-10">
          {about ? `"${about}"` : ""}
        </p>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            {skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Use the showButtons prop to conditionally render this div */}
        {showButtons && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-colors border border-slate-700"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Pass
            </button>

            <button
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;