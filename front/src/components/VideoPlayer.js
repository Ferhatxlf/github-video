import React, { useContext, useEffect, useRef } from 'react'
import { RoomContext } from '../context/RoomContext'
export const VideoPlayer=({stream}) =>{
    const VideoRef = useRef()
    const {son} =useContext(RoomContext)
    useEffect(()=>{
        if (VideoRef.current) VideoRef.current.srcObject = stream;
    },[stream])
  return (
    
    <div>
    <video  ref={VideoRef} autoPlay muted={son}></video>
    <br/>
    </div>
   
) 
}
