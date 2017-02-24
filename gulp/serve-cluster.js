const gulp = require('gulp');
const scom = require('scom-server');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Beware, this gul task does not handle js, sass or copy
gulp.task('serve-cluster', [], function() {
   const config = require('../config/config.json');

   if (cluster.isMaster) {
       // Fork workers.
       for (var i = 0; i < numCPUs; i++) {
           cluster.fork();
       }
       // Handle cluster termination
       cluster.on('exit', (worker, code, signal) => {
           console.log('>>> worker ${worker.process.pid} died');
           // In case of abnormal termination, spawn another worker
           if (!signal) {
               cluster.fork();
           }
       });
   } else {
       scom.default.start(config);
   }

   return true;
});
