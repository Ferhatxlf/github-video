import React, { useContext } from 'react'
import { RoomContext } from '../../context/RoomContext'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'

export default function Chat() {
    const {chat} = useContext(RoomContext)
    console.log(chat)
    
  return (
    <div className='chat_height'>
    <div className='w-64 flex flex-col h-full justify '>
        <div>
          {chat.messages.map((message)=>(
            <ChatBubble message={message}/>
          ))}
        </div>
        <ChatInput/>
    </div>
    </div>
  )
}
