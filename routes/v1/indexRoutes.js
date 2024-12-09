const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { pageTitle: 'Crazymax Back-End (Test)',featuredContent:'adfdfsdfsd'});
});

module.exports = router;
