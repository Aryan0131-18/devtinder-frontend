import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import axios from 'axios';

const UserCard = ({user}) => {
  if(!user) return null;
    const {_id,firstName,lastName,photoUrl,age,about,gender}=user;
    const dispatch=useDispatch();

    const handleSendRequest= async (status,userId)=>{
      try{
        const res=await axios.post(
          BASE_URL + "/request/send/"+status+"/"+ userId,{},
          {withCredentials:true},
        );
        dispatch(removeUserFromFeed(userId));
      }
      catch(err)
      {
        // Need to handle
      }
    }


  return (
  <div className="card bg-base-200 w-96 shadow-sm">
  <figure>
    <img
      src={user.photoUrl}
      alt="photo" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{firstName + " " + lastName}</h2>
    <p>{about}</p>
    {age && gender && <p>{age + " " + gender}</p>}
    <div className="flex gap-3 mt-4 justify-center">
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
  onClick={()=>handleSendRequest("ignored",_id)}>
    Ignore
  </button>

  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition duration-200"
  onClick={()=>handleSendRequest("interested",_id)}>
    Interested
  </button>
  </div>
  </div>
  </div>
  )
}

export default UserCard;
