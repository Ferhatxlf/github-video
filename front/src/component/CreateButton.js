import React, { useContext } from 'react'
import { RoomContext} from '../RoomContext'

export default function CreateButton() {
  const {ws}= useContext(RoomContext)
  const CreateRoom=()=>{
    ws.emit("create-room")
  }
  return (
    
    <button onClick={CreateRoom}> start new meeting</button>
  )
}
