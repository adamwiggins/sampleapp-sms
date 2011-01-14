require.paths.unshift('./node_modules');

var express = require('express');
var app = express.createServer(
  express.logger(),
  express.bodyDecoder()
);

app.get('/', function(req, res) {
  res.send('<form action="/" method="post">Msg: <input type="text" name="msg" /><input type="submit" /></form>');
});

app.post('/', function(req, res) {
  res.send('You said: ' + req.body.msg);
});

var port = parseInt(process.env.PORT || 3000);
console.log("Listening on port " + port);
app.listen(port);
