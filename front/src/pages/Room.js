import React, { useContext, useEffect} from 'react'
import { useParams  } from 'react-router-dom'
import  Navber  from '../components/Navber'
import { RoomContext } from '../context/RoomContext'
import {VideoPlayer} from '../components/VideoPlayer'
import '../app.css'
export default function Room() {
  const {id} = useParams()
  const {ws,me,stream,peers}= useContext(RoomContext)
  useEffect(()=>{
    
    if (me)  ws.emit("join-room",({roomId: id ,peerId: me._id}))
  },[me,id,ws])
  console.log(peers)
  return (
    <div >
    <Navber/>
      
    <div className='grid grid-cols-3 gap-3'>
      
    <VideoPlayer  stream={stream}/>
    {Object.values(peers).map((peer)=>(
      
        <VideoPlayer  stream={peer.stream}/>
     
      ))} 
      
      </div>
      
    </div>
   
  )
}
