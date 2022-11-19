import { createContext, useEffect, useReducer, useState } from 'react'
import  socketIOClient  from 'socket.io-client';
import {useNavigate} from 'react-router-dom'
import {v4 as uuidV4 } from 'uuid'
import { Peer } from 'peerjs'
import { peersReducer } from "./peersReducer";
import { addPeerAction } from './peerActions';

const WS ='http://localhost:5000'

export const RoomContext = createContext();

const ws = socketIOClient(WS)
export function ContextProvider ({children}){
    const Navigate = useNavigate()
    const [me, setMe]= useState()
    const [son, setson]= useState(true)
    const [stream, setStream]=useState()
    const [peers,dispatch]=useReducer(peersReducer, {})
    const [screenShId, setScreenShId] = useState()

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
})
    },[])

    useEffect(()=>{
        if(!me) return;
        if(!stream) return;
        
//demarrer lappel-------------------------------------------
        ws.on("user-joined",({peerId})=>{
            console.log('passer')
            const call = me.call(peerId,stream)
            
            console.log(call)
            call.on('stream', (peerStream)=>{
                
                dispatch(addPeerAction(peerId,peerStream))
                
                //dispatch({type : 'ADD_PEER' , payload : peerId,peerStream})
                
            
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
        <RoomContext.Provider value={{ws,me,stream,peers,screenShare,couperson,son}}>
            {children}
        </RoomContext.Provider>
    )

}