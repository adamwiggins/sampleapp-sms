require.paths.unshift('./node_modules');

var express = require('express');
var app = express.createServer(
  express.logger()
);

app.get('/', function(req, res){
    res.send('Hello World');
});

var port = parseInt(process.env.PORT || 3000);
console.log("Listening on port " + port);
app.listen(port);
