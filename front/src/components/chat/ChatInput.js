import React, { useContext, useState } from 'react'
import '../../app.css'
import { RoomContext } from '../../context/RoomContext'
import { RiSendPlaneFill } from 'react-icons/ri';
export default function () {
    const [message, setMessage] = useState()
    const {sendMessage}= useContext(RoomContext)
  return (
    <div >
        <form onSubmit={(e)=>{
          e.preventDefault();
          sendMessage(message);
          setMessage("")
        }} className='btn ' >
            <div>
            <div  className='flex'>
           < textarea 
            className=' border rounded h-8'
            onChange = {e => setMessage(e.target.value)}
            value={message}/>
           
            <button type='submit' className='px-2'><RiSendPlaneFill color='blue' size = '1.5rem' /></button>
            </div>
            </div>
            
        </form>
    </div>
  )
}
