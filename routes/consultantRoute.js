var express = require('express');
var router = express.Router();
var consulController = require('../controllers/consult-controller.js');
var serviceModel= require('../models/consultant-model.js');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the consultants route-- get--Afficher la liste des consultants 
router.get('/consultants', consulController.getAllConsultants);

// define one consultant route-- get--Afficher un consultant
router.get('/consultants/:id', consulController.getConsultant);

// define one consultant route-- get--Edit un consultant
router.get('/edit/:id', consulController.editByGetConsultant);
router.post('/edit/:id', consulController.editByPostConsultant);

// define one consultant route-- get--Delete un consultant
router.get('/delete/:id', consulController.deleteConsultant);

//recherche par nom projet
router.get('/search', consulController.searchConsultant);


module.exports = router;
