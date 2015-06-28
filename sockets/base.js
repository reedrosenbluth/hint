var nlp = require('nlp_compromise')
var nlp = require('nlp_compromise');
var info = require('../lib/info');

var black_list = [];
var white_list = ['Mark Zuckerberg', 'Facebook'];

module.exports = function (io) {

  // socket.io events
  io.on( "connection", function( socket ) {

    var already_heard = [];

    socket.on('new_result', function (result) {
      processResult(socket, result, already_heard, false);
    });
    socket.on('new_raw_result', function (result) {
      processResult(socket, result, already_heard, true);
    });

  });
}

function processResult(socket, result, results, isRaw) {
  socket.emit('started_speaking');
  var text = result.data;
  var entities = nlp.pos(text).nouns();
  //var people = nlp.pos(text).people();

  if (isRaw) {
    entities = checkWhiteList(text);
  }

  console.log(result);

  entities.forEach(function(entity, index, array) {
    var entity_text = entity.text;
    var tags = nlp.pos(entity_text).tags()[0];
    console.log(tags);
    if (results.indexOf(entity_text) === -1 && tags.indexOf('PRP') === -1) {
        console.log('entity: ' + entity_text);
        results.push(entity_text);
        info.getWikiInfo(entity_text)
            .then(function (data) {
                socket.emit('new_hint', data);
                console.log(data);
            });
    }
  });
}

function checkWhiteList (text) {
  var entities = [];
  white_list.forEach(function(word) {
    if (text.indexOf(word) > -1) {
      console.log('RAW WHITELIST')
      entities.push({text: word});
    };
  })

  return entities;
}
