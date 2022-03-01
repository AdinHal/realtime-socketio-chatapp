const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')


// Using app.use with cors() for fixing the Issues that might pop up with Cors
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    // Specifying some settings for Cors in the Socket.io Server
    cors:{
        // Telling our Server which origin will make the calls to the Servers, in this case our React Server
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket)=>{
    console.log(`User connected:`+socket.id)

    socket.on("join_room", (data)=>{
        socket.join(data)
        console.log("User with ID: "+socket.id+" joined room: "+data)
    })

    socket.on("send_message", (data)=>{
        socket.to(data.room).emit("receive_message", data)
    })

    // Disconnecting from the server
    socket.on("disconnect", ()=>{
        console.log("User Disconnected:", socket.id)
    })
})

server.listen(3001, ()=>{
    console.log("SERVER RUNNING")
})