var express = require('express');
var mongoose = require('mongoose');
var urlDB = 'mongodb://localhost/myapp';


exports.extensionsValides=['csv','json'];
//exports.fileExt //stock l'extension du fichier
var getExtension2 = function(filename)
    {
        var parts = filename.split(".");
        return (parts[(parts.length-1)]);
    }    


    // v�rifie l'extension d'un fichier upload�
    // filename : file a valider
    // listeExt : liste des extensions autoris�es
exports.verifFileExtension =  function(listeExt, filename )
    {
	//filename = document.getElementById(champ).value.toLowerCase();
	var fileExt = getExtension2(filename);
	for (var i=0; i<listeExt.length; i++)
	{
		if ( fileExt == listeExt[i] ) 
		{
			console.log("OK");
			return (true);
		}
	}
	console.log("le fichier doit etre csv ou json");
	return (false);
     }
 
exports.getExtension = function(filename)
    {
        var parts = filename.split(".");
        return (parts[(parts.length-1)]);
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