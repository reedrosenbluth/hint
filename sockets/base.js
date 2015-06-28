var nlp = require('nlp_compromise')

var results = [];

function processResult(result) {
  var sample = result.data;
  var entities = nlp.pos(sample).nouns();
  console.log(entities);

  entities.forEach(function(entity, index, array) {
    console.log(entity.text);
  })

  results.push(sample);
  console.log(results);
}

module.exports = function (io) {
  // socket.io events
  io.on( "connection", function( socket ) {
      console.log( "A user connected" );

      socket.on('new_result', processResult);
  });
}