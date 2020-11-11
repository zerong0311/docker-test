const express = require('express');
const router = express.Router();

//handle health check
router.get('/ping',  (req, res) =>{
    console.log(`${req.headers['x-forwarded-for'] || req.connection.remoteAddress} is pinging`);
    res.status(200).send({"success":"pong"})
});
  
// handle undefined Routes
router.get('*', function(req, res){
    res.status(404).send({"error":'Not found'});
});
  

module.exports = router;