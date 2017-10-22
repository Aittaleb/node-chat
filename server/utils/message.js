var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().format('h:mm')
  };
};

var generateLocationMessage = (from , latitude , longitude) => {
  return {
    from ,
    url : `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt : moment().format('h:mm')
  };
}

module.exports = {generateMessage , generateLocationMessage};
