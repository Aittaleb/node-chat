const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');



const { generateMessage , generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4200;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join',(params , callback) => {
    if( !isRealString(params.name) || !isRealString(params.room)){
      return callback('name and room name are required ');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUsersList' ,users.getUserList(params.room));


    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} just joined the room`));
    callback();
    
  });

  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    var user = users.getUser(socket.id);

    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    callback();
    
  });

  socket.on('createLocationMessage' , (position) => {
   

  //  socket.broadcast.emit('newMessage',generateMessage('admin','latitude :'+position.latitude + ' & longitude : '+ position.longitude));
  // socket.broadcast.emit('createLocationLink',position);
  //console.log('position : '+ position.latitude + ','+position.longitude );
  //console.log(JSON.stringify(generateLocationMessage('Admin',position.latitude,position.longitude)));
  io.emit('newLocationMessage',generateLocationMessage('Admin',position.latitude,position.longitude));

  });
  

  

  

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user){
    io.to(user.room).emit('updateUsersList' , users.getUserList(user.room));
    io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the conversation`));
    }
    
  });

});


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
