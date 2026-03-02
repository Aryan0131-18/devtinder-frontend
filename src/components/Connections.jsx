import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';

const Connections = () => {
    const connections=useSelector((store)=>store.connections);
    const dispatch=useDispatch();
    const fetchConnections=async ()=>{
        try{
            const res= await axios.get(BASE_URL + "/user/connection",{
                withCredentials:true,
            });
            dispatch(addConnections(res.data.data));
        }
        catch(err){
            // Need to Handle
        }
    }

    useEffect(()=>{
        fetchConnections();
    },[]);

    if(!connections) return null;

    if(connections.length===0) return <h1>No Connections Found</h1>;

     return (
    <div className="text-center my-10">
      <h1 className="text-bold text-2xl">Connections</h1>  

        {connections.map((connection) => {
    const {_id, firstName, lastName, photoUrl, age, gender, about } = connection;

    return (
        <div key={_id} className="border p-4 m-4 rounded-lg bg-base-200">
            <img alt="photo" className="w-20 h-20" src={photoUrl} />
            <h2>{firstName + " " + lastName}</h2>
            {age && gender && <p>{age + ", " + gender}</p>}
            <p>{about}</p>
        </div>
    );
    })}
    </div>
  )
}

export default Connections;
