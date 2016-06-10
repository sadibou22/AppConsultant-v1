var fs = require('fs');
var csv=require('csv2json-convertor');//importing csv2json-
var serviceApp = require('../services/servicesApp.js');
var serviceModel= require('../models/consultant-model.js');
var url = require('url');
const queryString = require('query-string');

exports.uploadFile = function(req, res){
    var sampleFile;

	if (!req.files) {
		res.send('No files were uploaded.');
		return;
	}
 
	sampleFile = req.files.sampleFile;
    var myPath = sampleFile.name;
	sampleFile.mv(myPath, function(err) {
		if (err) {
			res.status(500).send(err);
		}
		else {
			//res.send('File uploaded!');
			saveConsultants(myPath);
			res.render('success');
            
		}
	});
}

//all consultants
exports.getAllConsultants = function(req, res) {
    serviceModel.ConsultantModel.find(null)
	.exec(function(error, consultants){
		if(error) {
			res.send('error');
			//console.log(error);
		} else {
			//res.json(consultants);
			res.render('consultant', { title: 'Liste des consultants',allConsultants:consultants});
		}
	});
};

//get un consultant by id--AFFICHE UN CONSULTANT
exports.getConsultant = function(req, res) {
	var consulId = req.params.id;
    serviceModel.ConsultantModel.findById(consulId, function(err, consultant){
		if(err) {
			res.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultant == null) {
			res.send('Désolé, consultant inexistant');
			//res.json(consultant);		
		} else{
			//res.json(consultant); 
			res.render('affiche', { title: 'Consultant', unConsultant:consultant});
		}
	});
};

//Get un consultant by id--EDIT UN CONSULTANT
exports.editByGetConsultant = function(req, res) {
	var consulId = req.params.id;
    serviceModel.ConsultantModel.findById(consulId, function(err, consultant){
		if(err) {
			res.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultant == null) {
			res.send('Désolé, consultant inexistant');
			//res.json(consultant);		
		} else{
			//res.json(consultant); 
			res.render('edit', { title: 'Mise a jour consultant', unConsultant:consultant});
		}
	});
};
//Post un consultant by id--EDIT UN CONSULTANT
exports.editByPostConsultant = function(req, res) {
  var consultID = req.params.id;
  
  serviceModel.ConsultantModel.findById(consultID, function(err, c){
    if(err){throw err;}
    c.Prenom=req.body.prenom;
    c.Nom=req.body.nom;
    c.save();
    //res.redirect('/consultants/:id');
	return res.render('affiche', { title: 'Consultant', unConsultant:c});
  });
};


//get un consultant by id--DELETE UN CONSULTANT
exports.deleteConsultant = function(req, res) {
	var consulId = req.params.id;
    serviceModel.ConsultantModel.findByIdAndRemove(consulId, function(err, consultant){
		if(err) {
			res.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultant == null) {
			res.send('Désolé, consultant inexistant');
			//res.json(consultant);		
		} else{
			//res.json(consultant); 
			res.render('delete', { title: 'Consultant Supprimé...', unConsultant:consultant});
		}
	});
};


//Methode search 
exports.searchConsultant = function(req, res){
	var choice = req.query.searchChoice;
//debut
switch(choice)
{
	case"competence":getConsultantByCompetences(req.query.intputSearch, res);
	break;
	case "id":getConsultantByID(req.query.intputSearch, res);
	break;
	//execute code block 2
	case "nom":getConsultantByNom(req.query.intputSearch, res);
	break;
	//execute code block 2
	case "prenom":getConsultantByPrenom(req.query.intputSearch, res);
	break;
	//execute code block 2
	case "projet":getConsultantByProjet(req.query.intputSearch, res);
	break;
	//default: res.send('invalide choice..')	
}
//fin
}

//mes methodes
var saveConsultants = function(filname){
    
    
    
    //validation fichier avec l'extension
	var valideExt = serviceApp.verifFileExtension(serviceApp.extensionsValides,filname);
	console.log(valideExt);
    if(valideExt){
		//recuperer l'extension du fichier
		var fileExt = serviceApp.getExtension(filname);
		//if(fileExt=="csv"){var data1=csv.csvtojson(filname);} //csvtojson is function that accepts csv filenames and returns JSON object}
		//if(fileExt=='json'){var data1 = ReadJson(filname);}
        switch(fileExt)
        {
            case 'csv': var data=csv.csvtojson(filname);
                //console.log(data1);
                for (var i=0; i< data.length; i++){//debut 
                        saveConsultantCsvInMongo(data,i);
                } 
            break;
            case 'json':
                console.log('json filer..'+JSON.stringify(data[0]));//a traiter au besoin
                //myapp.consultatnt.insert(data);
                /*for (var i=0; i< data.length; i++){
                    saveConsultantTestJson(data, i);
                    } */
            break;
            default:
            console.log('Desolé, ce format de fichier ne peut pas etre traiter..')
        }
		
		
		//console.log(data1);

		//console.log(filname);
		//save data in mongo
		//saveInMongo(data1,fileExt);
	}else{
		console.log('Sorry fichier invalide '+ valideExt);
	}
	
	//ensuite delete le file pour ne pas encombré le server 
	fs.unlink(filname, function(err) {
		if (err) {
		return console.error(err);
		}
		console.log("File deleted successfully!");
	});
   
}

//save in mongo
var saveConsultantCsvInMongo = function(data,j){
	//var data = JSON.stringify(d);
	var c = new serviceModel.ConsultantModel({
		
		_id :  data[j].EmpId,
		Prenom : data[j].Prenom,
		Nom : data[j].Nom,
		Competences: [data[j].Competences],
		Projets : [data[j].Projet]
	});
	//c.Competences.push(data[j].Competences);
	//c.Projets.push(data[j].Projet);
	
	serviceModel.ConsultantModel.findById(data[j].EmpId, function(err, consultant){
		if(err) {
			console.log(err);
		} else if(consultant == null) {
			//console.log('Désolé, consultant inexistant donc save like insert');
			c.save(function (err) {
			if(err) {console.log(err);throw err;}
			//console.log('saved!!!! yeah');
			});
		} else{
			//console.log('yes, consultant existe donc save like update');
		 	c.update({
		
				//_id :  data[j].EmpId,
				Prenom : data[j].Prenom,
				Nom : data[j].Nom,
				Competences: [data[j].Competences],
				Projets : [data[j].Projet]
				},function (err) {
					if(err) {console.log(err);throw err;}
					//console.log('saved!!!! yeah');
			}); 
		}
	});
	
}

//recherche par projets
var getConsultantByProjet = function(projetName, c){
	//var projetName =req.query.projetName; //'ca';url.href;//.search;//.query.projetName;//req.params.projetName;
	var regex = new RegExp(["^", String, "$"].join(""), "i");
	
    serviceModel.ConsultantModel.find({Projets:{$regex: new RegExp('^' + projetName.toLowerCase(), 'i')}}, function(err, consultants){
		if(err) {
			c.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultants.length == 0) {
			c.send('Désolé, consultant inexistant');
			//res.json(consultant);		
		} else{
			//res.json(consultants); 
			//console.log(consultants); 
			return c.render('consultant', { title: 'Projet '+ projetName, allConsultants:consultants});
		}
	});
}

//recherche par competences
var getConsultantByCompetences = function(consulComp, c) {

 //var consulComp = req.query.Competences;
	//select * from consultant where (upper(consultant.competencies)) like '%competencies%'
	var regex = new RegExp(["^", String, "$"].join(""), "i");

	serviceModel.ConsultantModel.find({'Competences': {$regex: new RegExp('^' + consulComp.toLowerCase(), 'i')}}, function(err, consultants){
		if(err) {
			c.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultants.length ==0) {
			c.send('Désolé, consultant inexistant'); 
		} else{
		//res.json(consultant); 
			c.render('consultant', { title: 'Competences'+ consulComp, allConsultants:consultants});
		}
	});
};

//recherche by prenom
var getConsultantByPrenom = function(prenom, c){

	var regex = new RegExp(["^", String, "$"].join(""), "i");

	serviceModel.ConsultantModel.find({Prenom: {$regex: new RegExp('^' + prenom.toLowerCase(), 'i')}}, function(err, consultants){
		if(err) {
			c.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultants.length == 0) {
			c.send('Désolé, consultant inexistant'); 
		} else{
		//res.json(consultant); 
			c.render('consultant', { title: 'Prénom '+ prenom, allConsultants:consultants});
		}
	});

}

//recherche by nom
var getConsultantByNom = function(nom, c){
	var regex = new RegExp(["^", String, "$"].join(""), "i");
	try {
		serviceModel.ConsultantModel.find({Nom: {$regex: new RegExp('^' + nom.toLowerCase(), 'i')}}, function(err, consultants){
			if(err) {
				c.status(500).send('WARNING***quelques chose cloche!');
			} else if(consultants.length == 0) {
				c.send('Désolé, consultant inexistant'); 
			} else{
			//res.json(consultant); 
				c.render('consultant', { title: 'Nom'+ nom, allConsultants:consultants});
				//console.log('trouvé');
			}
		});

	} catch (err) {
	// Handle the error here.
	console.log('hum')
	}
	
}

//recherche by ID
var getConsultantByID = function(consulId, c){

	//var consulId = req.params.id;
    serviceModel.ConsultantModel.findById(consulId, function(err, consultant){
		if(err) {
			c.status(500).send('WARNING***quelques chose cloche!');
		} else if(consultant == null) {
			c.send('Désolé, consultant inexistant');
			//res.json(consultant);		
		} else{
			//res.json(consultant); 
			c.render('affiche', { title: 'Consultant ID: '+consulId, unConsultant:consultant});
		}
	});

}

