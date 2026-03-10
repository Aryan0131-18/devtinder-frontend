import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Feed Error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFeed();
  }, []);

  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#0f172a]">
        <div className="w-full max-w-md bg-slate-800/20 border border-slate-800 animate-pulse rounded-3xl h-[500px] flex flex-col p-6">
          <div className="w-full h-64 bg-slate-700/50 rounded-2xl mb-6"></div>
          <div className="h-8 bg-slate-700/50 w-3/4 rounded-lg mb-4"></div>
          <div className="h-4 bg-slate-700/50 w-full rounded-lg mb-2"></div>
          <div className="h-4 bg-slate-700/50 w-5/6 rounded-lg"></div>
        </div>
      </div>
    );
  }

  
  if (!feed || feed.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#0f172a] px-6 text-center">
        <div className="bg-slate-900 p-8 rounded-full mb-6 border border-slate-800 shadow-2xl">
          <span className="text-5xl">🚀</span>
        </div>
        <h1 className="text-2xl font-bold text-white">All caught up!</h1>
        <p className="text-slate-400 mt-2 max-w-xs">
          You've seen all the developers in your area. Check back later for new talent.
        </p>
        <button 
          onClick={getFeed}
          className="mt-8 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] bg-[#0f172a] overflow-hidden flex flex-col items-center justify-center px-4 py-10">
      
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-md lg:max-w-lg">
        
        <div className="mb-4 flex justify-between items-end px-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest">Discovery</h3>
            <span className="text-indigo-400 text-xs font-bold">{feed.length} devs nearby</span>
        </div>

       
        <div className="relative group transition-all duration-500 ease-out">
            
            <div className="absolute top-4 left-0 w-full h-full bg-slate-800/40 rounded-3xl -z-10 scale-[0.96] border border-slate-700/50"></div>
            
            <div className="transition transform active:scale-95 duration-200 cursor-grab active:cursor-grabbing">
                <UserCard user={feed[0]} />
            </div>
        </div>

       
        <p className="text-slate-500 text-center text-xs mt-8 animate-pulse tracking-wide">
          click buttons to connect
        </p>
      </div>

    </div>
  )
}

export default Feed;