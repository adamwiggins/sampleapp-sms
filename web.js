require.paths.unshift('./node_modules');

var express = require('express');
var app = express.createServer(
  express.logger(),
  express.bodyDecoder()
);

var queue = require('./queue');

app.get('/', function(req, res) {
  res.send('<form action="/" method="post">Msg: <input type="text" name="msg" />To: <input type="text" name="mobile_number" /><input type="submit" /></form>');
});

app.post('/', function(req, res) {
  queue.enqueue('send_sms', { msg: req.body.msg, mobile_number: req.body.mobile_number });
  res.send('You said: ' + req.body.msg);
});

var port = parseInt(process.env.PORT || 3000);
console.log("Listening on port " + port);
app.listen(port);
