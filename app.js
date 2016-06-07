var http = require('http');
var express = require('express');
/*fs = require('fs'),
mongoose = require('mongoose'),*/
var fileUpload = require('express-fileupload');
var consulController = require('./controllers/consult-controller.js');
var MongooseConnection = require('./models/consultant-model.js');
var serviceApp = require('./services/servicesApp.js');
var indexRoute = require('./index-route.js');
var consultantRoute = require('./consultantRoute.js');


var urlDB = 'mongodb://localhost/myapp';

app = express();


var port= 8080;

//Midleware
app.use(fileUpload());

//Connection BD
MongooseConnection.connect();
//serviceApp.connect();
/*****API****/
//gestion index et upload
app.use('/', indexRoute);

//gestion consultants
app.use('/', consultantRoute);


app.listen(port);
console.log('Application running on http://localhost:'+port);
