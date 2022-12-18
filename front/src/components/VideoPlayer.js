import React, { useContext, useEffect, useRef } from 'react'
import { RoomContext } from '../context/RoomContext'
import '../app.css'
import classNames from 'classnames'
export const VideoPlayer=({style,stream}) =>{
    const VideoRef = useRef()
    const {son,nbr_partic} =useContext(RoomContext)
    useEffect(()=>{
      if (stream !=null){
        if (VideoRef.current) VideoRef.current.srcObject = stream;
}},[stream])
  return (
    <>
    <video className={style?'style':`${classNames(
      {'video1':nbr_partic ===1,
        'video2':nbr_partic === 2,
        'video3_4':nbr_partic >=3,
        'video5_6':nbr_partic >=5,
        'video4_9':nbr_partic >=7,
        'video10_12':nbr_partic >=10,
        'video13_20':nbr_partic >=12,})}`} ref={VideoRef} autoPlay muted={son}></video> 
    </>
) 
}
