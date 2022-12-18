require("dotenv").config
const express = require('express')
const http = require('http')
const uuid =require('uuid')
const app=express()
const port = process.env.PORT || 5000

const server =http.createServer(app)
const io = require('socket.io')(server,{
    cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
})
const rooms={};
const chats = {}
const leaveRoom =  (rooms,socket,{roomId,peerId})=>{
    rooms[roomId]= rooms[roomId].filter((id) => id !== peerId )
    socket.to(roomId).emit("user-disconnected",peerId)
}
//connectin a la socket
io.on("connection",(socket)=>{
    console.log('user connected')
     
    //cree une room
	socket.on ("create-room",()=>{
        const roomId= uuid.v4()
        rooms[roomId]=[]
        console.log('user create room')
        socket.emit("room-created",{roomId})

    })
    socket.on("join-room", ({roomId, peerId})=>{
        if (!rooms[roomId]) rooms[roomId]=[]
        if (!chats[roomId]) chats[roomId] = [];
        socket.emit("get-messages", chats[roomId]);
            let i = 0
            rooms[roomId].forEach(element => {
                if (element === peerId) {
                    i= i + 1}
            });
            if (i === 0){
                console.log('user joind a room',roomId + peerId)
            rooms[roomId].push(peerId)
            
            socket.join(roomId)
            socket.to(roomId).emit("user-joined",{peerId})
            socket.emit("get-users",{
                roomId,
                participants: rooms[roomId]
            })
            }
        
        socket.on("disconnect",()=>{
            console.log("user left the room",peerId);
            leaveRoom(rooms,socket,{roomId,peerId})
        })
    })
    socket.on("start-sharing",({peerId,roomId})=>{
        socket.to(roomId).emit("user-started-sharing",peerId)
    })
    socket.on("stop-sharing",(roomId)=>{
        socket.to(roomId).emit("user-started-sharing")
    }) 
    socket.on("send-message",(roomId,message)=>{
        if (chats[roomId]) {
            chats[roomId].push(message);
        } else {
            chats[roomId] = [message];
        }
        socket.to(roomId).emit("add-message", message)
    })
    

    socket.on("disconnect",()=>{
        console.log('user disconnectd')
    })

})


server.listen(port, ()=>{
    console.log('server running at ',port)
})