var express = require('express');
var router = express.Router();
var consulController = require('./controllers/consult-controller.js');


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the consultants route-- get--Afficher la liste des consultants 
router.get('/consultants', consulController.getAllConsultants);

// define one consultant route-- get--Afficher un consultant
router.get('/consultants/:id', consulController.getConsultant);

module.exports = router;
