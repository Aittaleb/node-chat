const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io')

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8000;

 
var app = express();
var server = http.createServer(app);
var io = socketIo(server);

var NumberUsers = 0;

io.on('connection' , (socket) => {
    NumberUsers++;
    console.log('New User connected ' + NumberUsers );

    socket.on('disconnect', () => {
        NumberUsers--;
        console.log('Diconnected '+NumberUsers);
    });

    socket.emit('newMessage',{
        from : 'server',
        text : 'a fin a nossayr',
        createdAt : new Date().getTime()
    });

    socket.on('createMessage',(message) => { 
        message.receivedAt = new Date().getTime();
        console.log('message from the client ' + JSON.stringify(message));
    });
     
});



app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`server is up on ${port}`);
})
