var nlp = require('nlp_compromise')
var nlp = require('nlp_compromise');
var info = require('../lib/info');

var results = [];
var black_list = [];

module.exports = function (io) {
  
  // socket.io events
  io.on( "connection", function( socket ) {

    function processResult(result) {
      socket.emit('started_speaking');
      var text = result.data;
      var entities = nlp.pos(text).nouns();
      //var people = nlp.pos(text).people();
      
      entities.forEach(function(entity, index, array) {
        var entity_text = entity.text;
        var tags = nlp.pos(entity_text).tags()[0];
        if (results.indexOf(entity_text) <= -1 && tags.indexOf('PRP') <= -1) {
            console.log('entity: ' + entity_text);
            info.getWikiInfo(entity_text)
                .then(function (data) {
                    results.push(entity_text);
                    socket.emit('new_hint', data);
                });
        }
      });
    }

    socket.on('new_result', processResult);
  });
}