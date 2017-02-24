const gulp = require('gulp');
const paths = require('./paths.js')();

gulp.task('watch-copy', function() {
    gulp.watch(paths.src.img, ['copy']);
    gulp.watch('./index.html', ['copy']);
    gulp.watch(paths.src.fonts, ['copy']);
});