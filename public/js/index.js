var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});



jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

jQuery('#send-location').on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geoloacation not supported for this browser');
  }

   navigator.geolocation.getCurrentPosition(function (position) {
    // console.log(position);
    socket.emit('createLocationMessage',{
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    });
  },function () {
    alert('Unable to fetch the location');
  });

});

socket.on('createLocationLink' , function(position) {
  var locationLink = jQuery('a');
  locationLink.href='wwww.google.com/maps/'+position.latitude+','+position.longitude;
  var messageList = jQuery('#messages');
  messageList.append(locationLink);

});

socket.on('newLocationMessage', function(message) {

  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current Location</a>');

  li.text(`${message.from} : `);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);

});
