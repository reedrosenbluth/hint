var nlp = require('nlp_compromise')

function processSentence(sentence) {
  return 'sentence';
}

module.exports = function (io) {
  // socket.io events
  io.on( "connection", function( socket ) {
      console.log( "A user connected" );

      socket.on('new sentence', processSentence);
  });
}