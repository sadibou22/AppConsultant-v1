var express = require('express');
var router = express.Router();

router.get('/error', function(req, res){
    res.render('error', {message:'test'});
});

module.exports = router;