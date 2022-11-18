const Socket =require('socket.io')
const uuid = require("uuid")

const rooms = {};

module.exports.roomHandler = (socket)=>{
	const createRoom =()=>{
		const roomId = uuid.v4();
		rooms[roomId]=[];
		socket.emit("room-created", {roomId})
		console.log('user create a room');
	}
	const joinRoom =({roomId, peerId})=>{
		if (rooms[roomId]){
		console.log('user joined a room',roomId + peerId);
		rooms[roomId].push(peerId)
		socket.join(roomId);
		socket.emit("get-users",{
			roomId,
			participants:rooms[roomId],
		})

		socket.on("disconnect",()=>{
			console.log("user left the room",peerId);
			leaveRoom({roomId,peerId})
		})
	}

	const leaveRoom=({peerId,roomId})=>{
		rooms[roomId]=rooms[roomId].filter(id => id !== peerId)
		socket.to[roomId].emit("user-disconnect", peerId);
	}
}

	socket.on ("create-room",createRoom)
	socket.on("join-room",joinRoom)
}