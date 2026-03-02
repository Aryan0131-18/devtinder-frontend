import React, { useState } from 'react'
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import axios from 'axios';

const EditProfile = ({user}) => {

    const[firstName,setFirstName]=useState(user.firstName);
    const[lastName,setLastName]=useState(user.lastName);
    const[photoUrl,setPhotoUrl]=useState(user.photoUrl || "");
    const[age,setAge]=useState(user.age || "");
    const[gender,setGender]=useState(user.gender || "");
    const[about,setAbout]=useState(user.about || "");
    const[error,setError]=useState("");
    const dispatch=useDispatch();

    const saveProfile=async ()=>{
        // clear Errors
        setError("");
        try{
            const res=await axios.patch(BASE_URL + "/profile/edit",{
                firstName,
                lastName,
                photoUrl,
                age,
                gender,
                about,
            },
        {withCredentials:true}
    );
    dispatch(addUser(res?.data?.data));
        }
        catch(err){
            setError(err.response.data);
        }
    }
  return (
    <div className="flex justify-center items-start gap-12 my-16 px-6">
    <div className='bg-base-300 shadow-2xl rounded-2xl p-8 w-[420px]'>
      <div className="card bg-base-300 w-96 m">
    <div className="card-body">
    <h2 className="card-title  justify-center">Edit Profile</h2>
    <div className='space-y-4'>
      <label className="form-control w-full max-w-xs my=4">
        <div className="label">
          <span className="label-text">FirstName:</span>
        </div>
        <input 
        type="text"
        value={firstName}
        className="input input-bordered w-full max-w-xs"
        onChange={(e)=>setFirstName(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my=4">
        <div className="label">
          <span className="label-text">LastName:</span>
        </div>
        <input 
        type="text"
        value={lastName}
        className="input input-bordered w-full max-w-xs"
        onChange={(e)=>setLastName(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my=4">
        <div className="label">
          <span className="label-text">PhotoUrl:</span>
        </div>
        <input 
        type="text"
        value={photoUrl}
        className="input input-bordered w-full max-w-xs"
        onChange={(e)=>setPhotoUrl(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my=4">
        <div className="label">
          <span className="label-text">Age:</span>
        </div>
        <input 
        type="text"
        value={age}
        className="input input-bordered w-full max-w-xs"
        onChange={(e)=>setAge(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my=4">
        <div className="label">
          <span className="label-text">Gender:</span>
        </div>
        <input 
        type="text"
        value={gender}
        className="input input-bordered w-full max-w-xs"
        onChange={(e)=>setGender(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my=4">
        <div className="label">
          <span className="label-text">About:</span>
        </div>
        <input 
        type="text"
        value={about}
        className="input input-bordered w-full max-w-xs"
        onChange={(e)=>setAbout(e.target.value)}
        />
      </label>
    </div>
    <p className="text-red-600">{error}</p>
    <div className="card-actions justify-center m-2">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
    onClick={saveProfile}>
    Save Profile
    </button>    
    </div>
    </div>
    </div>
    </div>
    <div className="w-[420px]">
    <UserCard user={{firstName,lastName,photoUrl,age,gender,about}}/>
    </div>
    </div>
  )
}

export default EditProfile;
