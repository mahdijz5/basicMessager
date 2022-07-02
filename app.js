const http = require('http');

const express = require('express');
const {Server, Socket} = require('socket.io');

const app = express()
const server = http.createServer(app)
const io = new Server(server)


app.use(express.static('public'))

server.listen(3000,()=> {
    console.log('sasd');
})

const onlineUsers = {}

io.on('connection',(socket)=> {
    const id = socket.id
    
    socket.emit("guest",`guest_${id}`)
    
    // Listening
    
    socket.on('online',(data)=> {
        socket.join(data.room)
        onlineUsers[socket.id] = {
            name : data.name,
            room : data.room
        };
        
        console.log(onlineUsers);
        io.to(data.room).emit('onlineUsers',onlineUsers)
        
        console.log(`${data.name} is connected in ${data.room}`);
        
    })
    
    socket.on("disconnect", () => {
        delete onlineUsers[id] 
        console.log(`User  disconnected.`);
        io.sockets.emit("onlineUsers",onlineUsers)
        
    });
    
    socket.on("chat message", (data)=> {
        console.log(data);
        io.in(data.room).emit('chat message',data)
    })
    
    socket.on('typing',(data)=> {
        socket.to(data.room).emit("typing",data);
    })
    socket.on("pvChat", (data) => {
        console.log(`Private Chat Data:`);
        console.log(data);
        io.to(data.to).emit("pvChat", data);
    });
})
