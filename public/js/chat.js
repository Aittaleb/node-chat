var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();



  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
 
}

socket.on('connect', function () {
  console.log('Connected to server');

  var params = jQuery.deparam(window.location.search);
  
  socket.emit('join',params , function (err) {
      if(err){
          alert(err);
          window.location.href = '/';
      }else{
        console.log('No error');
      }
  });
  
});

socket.on('updateUsersList', function (users) {
  //console.log('user list :',users);
  
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);

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
  scrollToBottom();
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
  scrollToBottom();


});

socket.on('sendTime',(response) => {
  console.log('time :'+response.time)
});


socket.on('sendResponse',(data) => {
  console.log('reponse :'+data.response)
});




