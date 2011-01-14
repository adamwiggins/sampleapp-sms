require.paths.unshift('./node_modules');

var queue = require('./queue');
var restclient = require('./restclient/restclient');

send_sms = function(args, finish) {
  url = process.env.MOONSHADOSMS_URL;
  if (url) {
    restclient.POST(process.env.MOONSHADOSMS_URL + "/sms",
      { 'sms[device_address]': args.mobile_number, 'sms[message]': args.msg },
      function(res) {
        console.log("Got response: " + res);
        finish();
      });
  } else {
    console.log("no moonshado resource");
    finish();
  }
}

queue.run_worker({ send_sms: send_sms });
