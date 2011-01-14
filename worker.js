require.paths.unshift('./node_modules');

var queue = require('./queue');

send_sms = function(args, finish) {
  console.log("hello from job");
  finish();
}

queue.run_worker({ send_sms: send_sms });
