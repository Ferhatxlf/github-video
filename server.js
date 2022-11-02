const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const indexHandler = require('./room/index')
const port=5000
const app=express()

app.use(cors());
const server = http.createServer(app)
const  io = new Server(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});


io.on("connection",(socket)=>{
console.log('client connected')
indexHandler.roomHandler(socket);
  socket.on ("disconnect",()=> {
	console.log('client diconnected')
  })
})


server.listen(port, ()=>{
    console.log('server running at ',port)
})