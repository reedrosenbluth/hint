var nlp = require('nlp_compromise');
var info = require('../lib/info');

//var results = [];

module.exports = function (io) {
  // socket.io events
  io.on( "connection", function( socket ) {
    //console.log( "A user connected" );

    function processResult(result) {
      var text = result.data;
      var entities = nlp.pos(text).nouns();
      var people = nlp.pos(text).people();
      
      entities.forEach(function(entity, index, array) {
        // console.log('entity: ' + entity.text);
        info.getWikiInfo(entity.text)
          .then(function(result) {
            socket.emit('new_hint', result)
          })
          .catch(function(err) {
            console.log(err);
          });
      });

      // socket.emit('new_hint', {})

    }

    socket.on('new_result', processResult);
    // socket.emit('new_hint', )
  });
}
