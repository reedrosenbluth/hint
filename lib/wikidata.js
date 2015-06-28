var _ = require('lodash');
var Promise = require('bluebird');
var http = require('superagent');
var wdk = require('wikidata-sdk');
var commons = require('wmcommons');

var exports = module.exports = {};

function WikiData(options) {
  this.claims = options.claims;
}

function getID(search) {
  var url = wdk.searchEntities(search);
  
  return new Promise(function(fulfill, reject) {
    http
      .get(url)
      .end(function(err, res) {
        if (err) {
          reject(err);
        }
        fulfill(res.body.search[0].id);
      });
  });
};

function getClaims(id) {
  return new Promise(function(fulfill, reject) {
    var url = wdk.getEntities([id]);
    http
      .get(url)
      .end(function(err, res) {
        if (err) {
          reject(err);
        }
        fulfill(res.body.entities[id].claims);
      });
  });
};

exports.getImageName = function(search) {
  return getID(search)
    .then(getClaims)
    .then(function(claims) {
      var matched = {'P18': claims['P18']}
      console.log(matched);
      var simplifiedClaims = wdk.simplifyClaims(matched);
      return simplifiedClaims['P18'][0];
    });
}
