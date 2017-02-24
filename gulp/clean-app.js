const gulp = require('gulp');
const clean = require('gulp-clean');
const paths = require('./paths.js')();

var gutil = require('gulp-util');

gulp.task('clean-app', function() {
    gulp.src(paths.dist.base, {read: false})
        .pipe(clean({force: true}).on('error', gutil.log));
});
