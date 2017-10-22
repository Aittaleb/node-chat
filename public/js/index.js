var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment().format("h:mm");
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});



jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('');
  });
});

jQuery('#send-location').on('click', function() {
  var locationButton = jQuery('#send-location');
  if(!navigator.geolocation) {
    return alert('Geoloacation not supported for this browser');
  }

  locationButton.attr('disabled','disabled').text('Sending ...');
   navigator.geolocation.getCurrentPosition(function (position) {
    // console.log(position);
    socket.emit('createLocationMessage',{
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('Send Location');
  },function () {
    alert('Unable to fetch the location');
    locationButton.removeAttr('disabled').text('Send Location');

  });

});

socket.on('createLocationLink' , function(position) {
  var locationLink = jQuery('a');
  locationLink.href='wwww.google.com/maps/'+position.latitude+','+position.longitude;
  var messageList = jQuery('#messages');
  messageList.append(locationLink);

});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment().format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

});

socket.on('sendTime',(response) => {
  console.log('time :'+response.time)
});


socket.on('sendResponse',(data) => {
  console.log('reponse :'+data.response)
});




