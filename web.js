var express = require('express');
var app = express();
app.use(express.logger());


var fs =  require('fs');
var buffer = fs.readFileSync('index.html')
var outputString = buffer.toString('utf-8'); 
app.get('/', function(request, response) {
  response.send(outputString);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
