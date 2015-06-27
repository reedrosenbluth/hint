var express = require('express');
var nlp = require('nlp_compromise');
var router = express.Router();

var sample = 'So I just had this meeting with Mark Zuckerberg';

router.get('/', function(req, res, next) {
  var people = nlp.pos(sample).people();
  var data = {
    people: people
  };
  res.render('index', data);
});

module.exports = router;
