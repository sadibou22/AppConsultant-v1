var express = require('express');
var mongoose = require('mongoose');
var urlDB = 'mongodb://localhost/myapp';


exports.extensionsValides=['csv','json'];
//exports.fileExt //stock l'extension du fichier
exports.getExtension = function(filename)
    {
        var parts = filename.split(".");
        return (parts[(parts.length-1)]);
    }    


    // v�rifie l'extension d'un fichier upload�
    // filename : file a valider
    // listeExt : liste des extensions autoris�es
exports.verifFileExtension =  function(listeExt, filename)
    {
	//filename = document.getElementById(champ).value.toLowerCase();
	var fileExt = exports.getExtension(filename);
	for (var i=0; i<listeExt.length; i++)
	{
		if ( fileExt == listeExt[i] ) 
		{
			console.log("OK");
			return (true);
		}
	}
	console.log("le fichier doit etre csv ou json");
    //c.render('error', {message:'Desolé, ce format de fichier ne peut pas etre traiter..'});
	return (false);
    
    }
 
    
//connexion   
exports.connect = function(urlDB) {
    var cb = function(err, res) {
        if (err) {
            console.log('WARNING !****DB erreur connexion****:' + urlDB + '. ' + err);
        }
        else { console.log('Connexion a la BD '+urlDB+' OK!!'); }
    };
    mongoose.connect(urlDB, cb);
};