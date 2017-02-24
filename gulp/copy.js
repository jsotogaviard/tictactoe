const gulp = require('gulp');
const paths = require('./paths.js')();

gulp.task('copy', function() {
    gulp.src('./index.html')
        .pipe(gulp.dest(paths.dist.base));
    gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.dist.img));
    gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dist.fonts));
});