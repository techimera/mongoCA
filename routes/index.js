var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost/ScoreDB',{ useNewUrlParser: true });

var timeSchema = mongoose.Schema({ //Defines the Schema for this database
    Name: String,
    Time: String
});

var Time = mongoose.model('Time', timeSchema);

router.post('/time', function(req, res, next) {
    console.log("POST comment route"); 
    console.log(req.body);
    var newtime = new Time(req.body); 
    console.log(newtime); 
    newtime.save(function(err, post) { 
      if (err) return console.error(err);
      console.log(post);
      res.sendStatus(200);
    });
});

router.get('/time', function(req, res, next) {
    console.log("In the GET route");
    Time.find(function(err,commentList) { //Calls the find() method on your database
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log(commentList); //Otherwise console log the comments you found
        res.json(commentList); 
      }
    });
});

module.exports = router;
