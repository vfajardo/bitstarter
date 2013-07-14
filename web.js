

var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var fs=require('fs');
  var infile="index.html";
  var buf=fs.readFileSync(infile);
  response.send(buf.toString('utf8'));
  //response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
