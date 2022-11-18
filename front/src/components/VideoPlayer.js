import React, { useContext, useEffect, useRef } from 'react'
import { RoomContext } from '../context/RoomContext'

export const VideoPlayer=({css,stream}) =>{
    const VideoRef = useRef()
    const {screenShare} = useContext(RoomContext)
    useEffect(()=>{
        if (VideoRef.current) VideoRef.current.srcObject = stream;
    },[stream])
  return (
    
    <div>
    <video  className={css} ref={VideoRef} autoPlay muted={true}></video>

    <button onClick={screenShare}>screenShare</button>
    <br/>
    </div>
   
) 
}
