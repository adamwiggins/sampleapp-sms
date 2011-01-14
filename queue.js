var sys = require('sys');

var url = require('url').parse(process.env['QDBEAN_URL'] || "beanstalk://localhost:11300/");
var beanstalk = require('beanstalk_client').Client;

inspect = function(val) {
  return sys.inspect(val).replace(/\n/g, '');
}

exports.enqueue = function(job, args) {
  args = args || {}
  beanstalk.connect(url.hostname + ':' + url.port, function(err, conn) {
    if (err) throw err;
    conn.use(job, function(err) {
      conn.put(0, 0, 1, JSON.stringify([ job, args ]), function(err, job_id) {
        console.log('Enqueueing ' + job + ' ' + inspect(args));
      });
    });
  });
}

work_one_job = function(conn, handlers) {
  conn.reserve(function(err, id, body) {
    var data = JSON.parse(body);
    var job = data.shift();
    var args = data.shift();
    console.log('Working ' + job + ' ' + inspect(args));

    var handler = handlers[job];
    if (handler)
      handler(args, function() { finish_job(conn, job, id, handlers) });
    else {
      console.log("No such job");
      finish_job(conn, job, id);
    }
  });
}

finish_job = function(conn, job, id, handlers) {
  conn.destroy(id, function(err) {
    console.log('Finished ' + job);
    process.nextTick(function() {
      work_one_job(conn, handlers);
    });
  });
}

keys = function(dict) {
  keys = [];
  for (var key in dict)
    keys.push(key);
  return keys;
}

watch_jobs = function(conn, jobs, finished) {
  conn.watch(jobs[0], function(err) {
    jobs.shift();
    if (jobs.length == 0)
      finished();
    else
      watch_jobs(conn, jobs, finished);
  });
}

exports.run_worker = function(handlers) {
  jobs = keys(handlers);
  console.log("Working " + jobs.length + ' jobs: ' + jobs.join(' '));

  beanstalk.connect(url.hostname + ':' + url.port, function(err, conn) {
    if (err) throw err;
    watch_jobs(conn, jobs, function() {
      work_one_job(conn, handlers);
    });
  });
}
