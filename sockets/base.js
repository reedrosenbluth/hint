var nlp = require('nlp_compromise')
var info = require('../lib/info');

//var results = [];

function processResult(result) {
  var text = result.data;
  var entities = nlp.spot(text);
  var people = nlp.pos(text).people();
  //var nouns = [];

  //var tags = nlp.pos(text).tags();

  //tags.forEach(function(tag, index, array) {
  //  //console.log(tag);
  //  //console.log(tokens[index]);
  //  //console.log('');
  //  if (tag === 'NNP' || tag === 'NNPS' || tag === 'NNPA') {
  //    nouns.push(tokens[index]);
  //  }
  //});
  //
  entities.forEach(function(entity, index, array) {
      console.log(entity.text);
    info.getWikiInfo(entity.text)
        .then(function(data) {
            console.log(data);
        });

  })

  //people.forEach(function(person, index, array) {
  //  console.log('person: ' + person.text);
  //})

  //results.push(text);
  //console.log(results);
}

module.exports = function (io) {
  // socket.io events
  io.on( "connection", function( socket ) {
      //console.log( "A user connected" );

      socket.on('new_result', processResult);
  });
}