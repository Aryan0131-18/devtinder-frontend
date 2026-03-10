import React, { useState } from 'react';
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import axios from 'axios';

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    setShowSuccess(false);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-10 my-10 px-4">
      
      {/* Form Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-[2rem] p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Your Profile</h2>
        
        <div className="space-y-4">
          <div className="form-control w-full">
            <label className="label"><span className="label-text text-slate-400">First Name</span></label>
            <input 
              type="text" 
              value={firstName} 
              className="input input-bordered bg-slate-800 border-slate-700 text-white focus:border-indigo-500" 
              onChange={(e) => setFirstName(e.target.value)} 
            />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text text-slate-400">Last Name</span></label>
            <input 
              type="text" 
              value={lastName} 
              className="input input-bordered bg-slate-800 border-slate-700 text-white focus:border-indigo-500" 
              onChange={(e) => setLastName(e.target.value)} 
            />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text text-slate-400">Photo URL</span></label>
            <input 
              type="text" 
              value={photoUrl} 
              className="input input-bordered bg-slate-800 border-slate-700 text-white focus:border-indigo-500" 
              onChange={(e) => setPhotoUrl(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text text-slate-400">Age</span></label>
              <input 
                type="number" 
                value={age} 
                className="input input-bordered bg-slate-800 border-slate-700 text-white focus:border-indigo-500" 
                onChange={(e) => setAge(e.target.value)} 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-slate-400">Gender</span></label>
              <select 
                value={gender} 
                className="select select-bordered bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="form-control w-full">
          <label className="label">
          <span className="label-text text-slate-400 font-semibold">About</span>
          </label>
          <textarea 
          placeholder="Tell us about your tech stack..."
          value={about} 
          className="textarea textarea-bordered bg-slate-800 border-slate-700 text-white h-32 focus:border-indigo-500 text-base leading-relaxed resize-none" 
          onChange={(e) => setAbout(e.target.value)} 
          />
        </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {showSuccess && <p className="text-green-500 text-sm mt-4 text-center">Profile updated successfully! ✨</p>}

        <button 
          className="btn btn-primary w-full mt-8 bg-indigo-600 border-none hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20"
          onClick={saveProfile}
        >
          Save Changes
        </button>
      </div>

      {/* Preview Section */}
<div className="w-full max-w-sm sticky top-10">
  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 text-center">
    Live Preview
  </p>
  
  {/* Pass showButtons={false} to hide Pass/Connect on  profile */}
  <UserCard 
    user={{ firstName, lastName, photoUrl, age, gender, about }} 
    showButtons={false} 
  />
  </div>
  </div>
  );
};

export default EditProfile;