var _ = require('lodash');
var Promise = require('bluebird');
var http = require('superagent');
var Wiki = require('wikijs');
var commons = require('wmcommons');
var info = require('./lib/info');
var fs = require('fs'); 

var whitelist = JSON.parse(fs.readFileSync('./json/whitelist.json', 'utf8')).words;

var mapping = JSON.parse(fs.readFileSync('./json/mapping.json', 'utf8'));

console.log(whitelist);
var err = 0;
var complete = 0;
for (wd in whitelist)
{
	word = whitelist[wd];
	//console.log(word);

	if (mapping.hasOwnProperty(word.toLowerCase()))
	{
		word = mapping[word.toLowerCase()];
	}


	info.getWikiInfo(word)
    .then(function (data) {
       console.log('"' + data['title'] + '" :');
       console.log(JSON.stringify(data));
       console.log(",");
        complete += 1;

    }).catch(function(e){
    	err += 1;
    	 console.log("ERR:");
    	// console.log(e);
    	// console.log("**");
    });
}