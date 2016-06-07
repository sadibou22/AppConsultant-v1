var express = require('express');
var router = express.Router();
var consulController = require('./controllers/consult-controller.js');


// define the home page route for get
router.get('/', function(req, res) {
  res.sendFile(__dirname+'/views/index.html');
});

// define the home page route for post
router.post('/upload', consulController.uploadFile);

module.exports = router;