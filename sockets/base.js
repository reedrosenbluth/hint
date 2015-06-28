var nlp = require('nlp_compromise')
var info = require('../lib/info');
var http = require('superagent');
var fs = require('fs');

var black_list = JSON.parse(fs.readFileSync(__dirname + '/../json/blacklist.json', 'utf8')).words;
var white_list = JSON.parse(fs.readFileSync(__dirname + '/../json/whitelist.json', 'utf8')).words;
var white_list_mapping = JSON.parse(fs.readFileSync(__dirname + '/../json/mapping.json', 'utf8'));

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
    checkWhiteList(socket, text, results);
    return
  }

  entities.forEach(function(entity, index, array) {
    var entity_text = entity.text;
    var tags = nlp.pos(entity_text).tags()[0];
    if (!isBlackListed(entity_text)) {
      getWikiData(socket, entity_text, results, tags)

    }
  });
}


function checkWhiteList (socket, text, results) {
  var entities = [];

  white_list.forEach(function(word) {
    if (text.toLowerCase().indexOf(word.toLowerCase()) > -1) {
      entities.push({text: word});
      getWikiData(socket, text, results);
    };
  })

  return entities;
}

function isBlackListed (entity_text) {
  black_list.forEach(function (word) {
    if (entity_text.toLowerCase().indexOf(word.toLowerCase()) > -1) {
      return true;
    }
  })

  return false;
}

function getWikiData(socket, entity_text, results, tags) {
    if (white_list_mapping.hasOwnProperty(entity_text)) {
      entity_text = white_list_mapping[entity_text];
    }

    if (!tags) {
      tags = [];
    }

    if (results.indexOf(entity_text) === -1 && tags.indexOf('PRP') === -1 && (tags.indexOf('PP') === -1)) {
        console.log('entity: ' + entity_text);
        results.push(entity_text);
        info.getWikiInfo(entity_text)
            .then(function (data) {
                socket.emit('new_hint', data);
                console.log(data);
            });

        getStockTicker(entity_text)
            .then(function (data) {
                console.log(data);
                //console.log(data);
            });
    }
}

    function getStockTicker(entity) {
        url = "http://dev.markitondemand.com/Api/v2/Lookup?input=" + entity;
        console.log(url);
        return new Promise(function(fulfill, reject) {
            http
                .get(url)
                .end(function(err, res) {
                    if (err) {
                        reject(err);
                    }
                    var xml = res;
                    console.log('xml' + xml);
                    fulfill(xml);
                });
        });
    }
