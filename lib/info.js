var _ = require('lodash');
var Promise = require('bluebird');
var http = require('superagent');
var nlp = require('nlp_compromise');
var wikidata = require('../lib/wikidata');
var Wiki = require('wikijs');

var wiki = new Wiki();

var exports = module.exports = {};

function getImageLink(title) {
  var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + title + '&prop=pageimages&format=json&pithumbsize=125';
  return new Promise(function(fulfill, reject) {
    http
      .get(url)
      .end(function(err, res) {
        if (err) {
          reject(err);
        }
        var pages = res.body.query.pages;
        var first_page = pages[Object.keys(pages)[0]];
        if ('thumbnail' in first_page) {
          fulfill(first_page.thumbnail.source);
        }
        fulfill(null);
      });
  });
}

exports.getWikiInfo = function(search_term) {
  return new Promise(function(fulfill, reject) {
    wiki.page(search_term)
      .then(function(page) {
        console.log(page);
        var title = page.title;
        return Promise.all([page.summary(), page.info(), getImageLink(title), title]);
      })
      .then(function(data) {
        console.log(nlp.sentences(data[0]));
        var summary = _.reduce(_.take(nlp.sentences(data[0]), 4), function(total, n) {
          return total + ' ' + n;
        });
        var json = {
          summary: summary,
          info: data[1],
          image: data[2],
          title: data[3]
        };
        fulfill(json);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
