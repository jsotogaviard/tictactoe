const gulp = require('gulp');
const scom = require('scom-server');

gulp.task('serve', ['js', 'sass', 'copy'], function() {
   const config = require('../config/config.json');
   scom.default.start(config);
   return true;
});
