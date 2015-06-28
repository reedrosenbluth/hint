var nlp = require('nlp_compromise');
var info = require('../lib/info');
var http = require('superagent');
var fs = require('fs');

var black_list = JSON.parse(fs.readFileSync(__dirname + '/../json/blacklist.json', 'utf8')).words;
var white_list = JSON.parse(fs.readFileSync(__dirname + '/../json/whitelist.json', 'utf8')).words;
var white_list_mapping = JSON.parse(fs.readFileSync(__dirname + '/../json/mapping.json', 'utf8'));
var white_list_cache = JSON.parse(fs.readFileSync(__dirname + '/../json/cache.json', 'utf8'));

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

};

function processResult(socket, result, results, isRaw) {
  socket.emit('started_speaking');
  var text = result.data;
  var entities = nlp.pos(text).nouns();

  if (isRaw) {
    checkWhiteList(socket, text, results);
    return;
  }

  entities.forEach(function (entity, index, array) {
    var entity_text = entity.text;
    var tags = nlp.pos(entity_text).tags()[0];
    if (!isBlackListed(entity_text)) {
      getWikiData(socket, entity_text, results, tags);
    }
  });
}

function checkWhiteList (socket, entity_text, results) {

  white_list.forEach(function(word) {
    if (entity_text.toLowerCase().indexOf(word.toLowerCase()) > -1) {
      getWikiData(socket, word, results);
    }
  });
}

function isBlackListed (entity_text) {
    var found = false;
  black_list.forEach(function (word) {
    if (entity_text.toLowerCase() === word.toLowerCase()) {
        console.log(entity_text + 'is blacklisted');
        found = true;
    }
  });

  return found;
}

function getWikiData(socket, entity_text, results, tags) {

  // console.log(entity_text);
    var found_in_cache = false;
    var entity_text2 = entity_text;
    if (white_list_mapping.hasOwnProperty(entity_text.toLowerCase())) {
      
     // console.log("found in white list");
      if (white_list_cache.hasOwnProperty(white_list_mapping[entity_text.toLowerCase()]))
      {
        found_in_cache = true;
        data = white_list_cache[white_list_mapping[entity_text.toLowerCase()]];    
          
      }
      entity_text2 = white_list_mapping[entity_text.toLowerCase()];
    }
    else
    {
      if (white_list_cache.hasOwnProperty(entity_text))
      {
        found_in_cache = true;
        data = white_list_cache[entity_text];    
          
      }
      entity_text2 = entity_text;
    }
    // console.log(entity_text);
    // console.log("***");

    if (!tags) {
      tags = [];
    }

    if (results.indexOf(entity_text.toLowerCase()) === -1 && results.indexOf(entity_text2) === -1 && found_in_cache) {
        // console.log(results);
        results.push(entity_text.toLowerCase());
        results.push(white_list_mapping[entity_text.toLowerCase()]);
        console.log("**** USED THE CACHE ****");
        console.log(entity_text2);
        socket.emit('new_hint', data);

        // console.log(data);
    }

    else {

      if (results.indexOf(entity_text.toLowerCase()) === -1 && results.indexOf(entity_text2) === -1 && tags.indexOf('PRP') === -1 && (tags.indexOf('PP') === -1)) {
        // console.log(results);
          console.log("**** USED THE WEB ****");
          console.log(entity_text2);
          // console.log('entity: ' + entity_text);
          results.push(entity_text.toLowerCase());
          results.push(entity_text2);
          info.getWikiInfo(entity_text2)
              .then(function (data) {
                  socket.emit('new_hint', data);
           //       console.log(data);
              });

          //getStockTicker(entity_text)
          //    .then(function (data) {
          //        console.log(data);
          //        //console.log(data);
          //    });
      }
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