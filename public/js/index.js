var socket = io();
socket.on('connect', () => {
    console.log('connected to server');
});

socket.on('disconnect', () => {
    console.log('Server disconnected');
}); 

socket.on('newMessage', (message) => {
    
    console.log('New message ' ,message );
});

socket.emit('createMessage', {
    to : 'hamid@hotmail.com',
    text : 'hania a 5oya abdessamad'
});