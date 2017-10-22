const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');


const { generateMessage , generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4200;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
    
  });

  socket.on('createLocationMessage' , (position) => {
  //  socket.broadcast.emit('newMessage',generateMessage('admin','latitude :'+position.latitude + ' & longitude : '+ position.longitude));
  // socket.broadcast.emit('createLocationLink',position);
  //console.log('position : '+ position.latitude + ','+position.longitude );
  //console.log(JSON.stringify(generateLocationMessage('Admin',position.latitude,position.longitude)));
  io.emit('newLocationMessage',generateLocationMessage('Admin',position.latitude,position.longitude));

  });

  socket.on('geTime' ,() => {
    console.log('getTime');
    io.emit('sendTime', {
      time : moment().format('h:mm')
    });
  });

  socket.on('question',(qst) => {
    console.log('je recois une question !! => '+qst.text);
    io.emit('sendResponse',{
      response : 'je confirme avoir recu votre question :'+qst.text
    })
  })
  

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

});


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
