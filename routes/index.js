var express = require('express');
var nlp = require('nlp_compromise');
var WikiData = require('../lib/wikidata');
var info = require('../lib/info');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
})

router.get('/:search', function(req, res, next) {
  // info.getWikiInfo(req.params.search.replace('+',' '))
  //   .then(function(data) {
  //     res.render('index', data);
  //   });
  res.render('index');
});

module.exports = router;
