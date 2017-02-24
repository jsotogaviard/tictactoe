const gulp = require('gulp');
const paths = require('./paths.js')();

gulp.task('watch-sass', function() {
    gulp.watch(paths.src.sass.base, ['sass']);  // watch all the .less files, then run the less task
});
