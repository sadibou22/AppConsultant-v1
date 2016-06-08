//var model = module.exports,
var express = require('express');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    urlDB = 'mongodb://localhost/myapp',
    fs = require('fs'),
    http = require('http');
var ObjectId = Schema.ObjectId;

//connexion   
exports.connect = function() {
    var cb = function(err, res) {
        if (err) {
            console.log('WARNING !****DB erreur connexion****:' + urlDB + '. ' + err);
        }
        else { console.log('Connexion a la BD '+urlDB+' OK!!'); }
    };
    mongoose.connect(urlDB, cb);
};

//creation de schema d'enregistrement des consultants a reconfigurer 
var consultantSchema = new mongoose.Schema({
	_id : {type: Number, required:true },
	Prenom : { type: String },
	Nom : { type: String },
	Competences : [],
	Projets : []
});

//creation de mon model pour les consultants(ma classe)
exports.ConsultantModel = mongoose.model('Consultant',consultantSchema);

