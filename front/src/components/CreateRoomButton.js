import React, { useContext, useState } from 'react'
import { RoomContext } from '../context/RoomContext'

import {useNavigate} from 'react-router-dom'
export default function CreateRoomButton() {

  const {ws}= useContext(RoomContext)
  const [jo,setjo]=useState()
  const Navigate = useNavigate();
  const createRoom=()=>{
    ws.emit("create-room")
  }
  const joinroom=()=>{
     ws.emit("join-room",{roomId: jo})
     Navigate(`/room/${jo}`)
  }
  return (
    <>
    <button onClick={createRoom} className='bg-rose-400 rounded-lg text-white px-4 hover:bg-rose-600'>
        create vedio
    </button>
    <input type='text' onChange={(e) => setjo(e.target.value)}/>
    <button onClick={joinroom}>
        join room
    </button>
    </>
  )
}
