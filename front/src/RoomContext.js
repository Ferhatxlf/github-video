import React, { createContext, useEffect, useState } from 'react';
import  socketIOClient  from 'socket.io-client';
import {v4}  from 'uuid'
import Peer from 'peerjs'
import {useNavigate} from 'react-router-dom'
const WS ='http://localhost:5000'
const RoomContext = createContext();

const ws = socketIOClient(WS);

const RoomProvider = ({ children }) => {
  const navigate= useNavigate()
  const [me,setMe]= useState();
  const enterRoom =({roomId})=>{
    navigate(`/room/${roomId}`)
  }

  const getUsers =({participants})=>{
    console.log({participants})
  }

useEffect(()=>{
  const meId=v4();
  const peer = new Peer(meId,{
  })
  setMe(peer)
  
  ws.on("room-created",enterRoom)
  ws.on("get-users",getUsers)
})
  return (
    <RoomContext.Provider value={{ws, me}}
    >
      {children}
    </RoomContext.Provider>
  );
};

export { RoomProvider, RoomContext };