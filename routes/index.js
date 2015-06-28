var express = require('express');
var nlp = require('nlp_compromise');
var WikiData = require('../lib/wikidata');
var info = require('../lib/info');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
})

router.get('/:search', function(req, res, next) {
  res.render('index');
});

module.exports = router;
