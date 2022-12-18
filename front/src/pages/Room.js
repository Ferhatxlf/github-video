import React, { useContext, useEffect} from 'react'
import { useParams  } from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'
import  Navbar  from '../components/navbar/Navbar'
import { RoomContext } from '../context/RoomContext'
import {VideoPlayer} from '../components/VideoPlayer'
import './Room.css'
import Chat from '../components/chat/Chat'
import Users from '../components/users/Users'
export default function Room() {
  const {id} = useParams()
  const {ws,me,stream,peers,screenShId,setRoomId,chat,user,nbr_partic}= useContext(RoomContext)
  
  useEffect(()=>{
    if (me)  ws.emit("join-room",({roomId: id ,peerId: me._id}))
  },[me,id,ws])

  useEffect(()=>{
    setRoomId(id)
  },[id,setRoomId])

  //console.log({screenShId})
  const screenSharingVideo = 
  screenShId === me?.id? stream: peers[screenShId]?.stream
  const { [screenShId]: sharing, ...peersToShow } = peers;
  return (
    <div className='container1 flex flex-col min-h-screen'>
      <Navbar/>
      {user && <Users />}
      
        <div className="flex grow">
                {screenSharingVideo && (
                    <div className="partage">
                        <VideoPlayer style='width=100%' stream={screenSharingVideo}/> 
                        
                    </div>
                )}
        <div className={`${screenSharingVideo ? "apres_partage":"container_video"}`} >
        

                    { screenShId !== me?.id && (
                      
                    <VideoPlayer  stream={stream}/>
                    )}

                
                {Object.values(peersToShow).map((peer)=>(
                
           peer.stream !=null && <VideoPlayer key={uuidV4()} stream={peer.stream}/>
                  
           
      ))} 
       </div>
       </div>
     
      
      {chat.isChatOpen && (
      <div className='chat'>
        <Chat/>
      </div>
      )}
        </div>
       
        
    
  )
}
