import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connection", {
        withCredentials: true,
      });
      // Verify if your backend response structure is res.data.data or just res.data
      const connectionData = res.data.data || res.data; 
      dispatch(addConnections(connectionData));
    } catch (err) {
      console.error("Failed to fetch connections", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 animate-pulse">Syncing your network...</p>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <div className="text-center bg-slate-900/50 p-10 rounded-[2rem] border border-slate-800 max-w-lg w-full shadow-2xl">
          <div className="text-5xl mb-6">🤝</div>
          <h1 className="text-2xl font-bold text-white mb-2">No Connections Yet</h1>
          <p className="text-slate-400 mb-8">
            Collaborations start with a single request. Explore the feed to find your next teammate.
          </p>
          <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95">
            Explore Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Connections</h1>
          <p className="text-slate-500 mt-1">Developers you've successfully paired with.</p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={fetchConnections} className="text-slate-400 hover:text-white text-sm transition-colors">Refresh</button>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            {connections.length} Matches
            </span>
        </div>
      </div>

      {/* Connection List */}
      <div className="grid grid-cols-1 gap-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, about, skills } = connection;

          return (
            <div 
              key={_id} 
              className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-[1.5rem] hover:border-indigo-500/30 transition-all group"
            >
              {/* Photo with fallback */}
              <div className="relative shrink-0">
                <img 
                  alt={firstName} 
                  className="w-20 h-20 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all" 
                  src={photoUrl || "https://geographyandyou.com/images/user-profile.png"} 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${firstName}&background=6366f1&color=fff`;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>

             
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {firstName} {lastName}
                </h2>
                <p className="text-slate-400 text-sm line-clamp-1 italic mt-1 font-light">
                  "{about || "Ready to build something amazing."}"
                </p>
                
                
                {skills && skills.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                    {skills.slice(0, 4).map(skill => (
                      <span key={skill} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <Link to={"/chat/" + _id} className="block">
                  <button className="w-full sm:w-auto bg-slate-800 hover:bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl transition-all border border-slate-700 hover:border-indigo-500 shadow-xl active:scale-95">
                    Message
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;