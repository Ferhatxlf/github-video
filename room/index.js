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
	const joinRoom =({roomId,peerId })=>{
		
		rooms[roomId].push(peerId)
		if (rooms[roomId]){
		console.log('user joined a room',roomId + peerId);
		socket.join(roomId)

		socket.emit('get-users',{
			roomId,
			participants: rooms[roomId],

		})
	}
	}
	 



	socket.on ("create-room",createRoom)
	socket.on("join-room",joinRoom)

}