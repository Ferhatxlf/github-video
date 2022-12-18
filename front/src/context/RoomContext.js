import { createContext, useEffect, useReducer, useState } from 'react'
import  socketIOClient  from 'socket.io-client';
import {useNavigate} from 'react-router-dom'
import {v4 as uuidV4 } from 'uuid'
import  Peer  from 'peerjs'
import { peersReducer } from "../reducers/peersReducer";
import { addPeerAction, removePeerAction } from '../reducers/peerActions';
import { addHistoryAction, addMessageAction,toggleChatAction } from '../reducers/chatActions';
import {chatReducer} from '../reducers/chatReducer'

const WS ='http://localhost:5000'

//const WS ='https://f-server-nodejs.onrender.com'
export const RoomContext = createContext();

const ws = socketIOClient(WS)
export function ContextProvider ({children}){
    const Navigate = useNavigate()
    const [me, setMe]= useState()
    const [user, setUser]= useState(false)
    const [son, setson]= useState(true)
    const [stream, setStream]=useState()
    const [peers,dispatch]=useReducer(peersReducer, {})
    const [nbr_partic, setNbr] = useState()
    const [chat,chatdispatch]=useReducer(chatReducer, {
        messages: [],
        isChatOpen: false,
    })
    const [screenShId, setScreenShId] = useState()
    const [roomId, setRoomId]= useState('')

const switchStream =(stream)=>{
    setStream(stream);
    if (screenShId === me._id){
        setScreenShId("")
    }else setScreenShId(me._id)

    // changer le flus video par le flus de l'écran--------------------------------------------------
    Object.values(me?.connections).forEach((connection)=>{
    const videoTrack = stream?.getTracks().find(track => track.kind === 'video');
    connection[0].peerConnection
    .getSenders()[1]
    .replaceTrack(videoTrack)
    .catch((err)=> console.log(err))
})
    // recuperer le flus partage decran-------------------------------------------------------------   
}
const screenShare=()=>{
    if (screenShId){
        navigator.mediaDevices.getUserMedia({video : true , audio: true}).then(switchStream)
    }else{
        navigator.mediaDevices.getDisplayMedia({}).then(switchStream)
    }
}


const couperson = ()=>{
    if (son === false) {
        setson(true)
    }else {
        setson(false)
    }
}
const afficher_users = () =>{
    setUser(!user)
}
const sendMessage = (message)=>{
    const messageData ={
        content: message,
        timestamp: new Date().getTime(),
        author:me?.id,
    }
    
    chatdispatch(addMessageAction(messageData))
    ws.emit("send-message",roomId, messageData)
}

const toggleChat =()=>{
    
    chatdispatch(toggleChatAction(!chat.isChatOpen))
}
useEffect(()=>{
//crée un peer---------------------------------------------------------------------
         const meid = uuidV4()
         const peer = new Peer(meid)
         setMe(peer)
         try{
            // crée une video ------------------------------------------------------------
                        navigator.mediaDevices
                        .getUserMedia({video : true, audio: true})
                        .then((stream)=>{
                           setStream(stream)
                       })
                     }catch(err){ 
                       console.log(err)
                     }

 // ecouter l'event room-created et rejoindre la room---------------------    
        ws.on("room-created", ({roomId})=>{
            Navigate(`/room/${roomId}`)})
        
// ecouter l'event get-users et afficher les participant a la room----------------
        ws.on("get-users",({participants})=>{
            
            console.log(participants)
            setNbr(participants.length)
        })
        ws.on("user-disconnected",(peerId)=>{
            dispatch(removePeerAction(peerId));
        })
        ws.on("user-started-sharing",(peerId)=> setScreenShId(peerId))
        ws.on("user-stoped-sharing",()=> setScreenShId(""))

        ws.on("add-message",(message)=> {
            console.log(message)
        chatdispatch(addMessageAction(message))
        }
            )

        ws.on("get-messages",(messages)=>{
            chatdispatch(addHistoryAction(messages))
        })

        return ()=>{
            ws.off("room-created")
            ws.off("get-users")
            ws.off("user-disconnected")
            ws.off("user-start-sharing")
            ws.off("user-stop-sharing")
            ws.off("user-joined")
            ws.off("add-message")
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        if (screenShId){
            ws.emit("start-sharing", {peerId:screenShId, roomId})
        } else {
            ws.emit("stop-sharing")

        }
    },[screenShId,roomId])

    useEffect(()=>{
        if(!me) return;
        if(!stream) return;
        
//demarrer lappel-------------------------------------------
        ws.on("user-joined",({peerId})=>{
            const call = me.call(peerId,stream)
            call.on('stream', (peerStream)=>{
                console.log(peerStream)
                if (peerStream != null){
                dispatch(addPeerAction(peerId,peerStream))
        }
    })
        })

// repondre au appel des autres peer --------------------------------
        me.on("call",(call)=>{
            call.answer(stream)
            call.on("stream", (peerStream)=>{
                dispatch(addPeerAction(call.peer,peerStream))
                
            })
        })
    },[me, stream])
    return(
        <RoomContext.Provider value={{ws,me,stream,peers,screenShare,
        couperson,son,screenShId,chat,toggleChat,
        setRoomId,sendMessage,afficher_users,user,nbr_partic}}>
            {children}
        </RoomContext.Provider>
    )

}