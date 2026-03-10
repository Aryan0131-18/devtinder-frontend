import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestSlice';

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Review failed", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="text-center p-10 bg-slate-900/50 rounded-3xl border border-slate-800">
          <h1 className="text-xl font-bold text-slate-400">No pending requests 🕊️</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight">
        Incoming Requests
      </h1>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((request) => {
          // Destructure from the populated user object
          const { firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;

          return (
            <div 
              key={request._id} 
              className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all"
            >
              {/* Responsive Image */}
              <div className="shrink-0">
                <img 
                  alt="profile" 
                  className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl object-cover ring-2 ring-indigo-500/20" 
                  src={photoUrl || "https://geographyandyou.com/images/user-profile.png"} 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${firstName}&background=6366f1&color=fff`;
                  }}
                />
              </div>

              {/* Text Info */}
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider">
                    {age} • {gender}
                  </p>
                )}
                <p className="text-slate-400 text-sm mt-1 line-clamp-1 italic">
                  "{about}"
                </p>
              </div>

              {/* Responsive Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-2.5 rounded-xl font-bold transition-all border border-slate-700"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Ignore
                </button>

                <button 
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;