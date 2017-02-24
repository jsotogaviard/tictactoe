const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const paths = require('./paths.js')();

var gutil = require('gulp-util');

gulp.task('sass', function() {
    return gulp.src(paths.src.sass.app)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(autoprefixer({browsers: ['last 2 versions', '> 5%', 'Firefox ESR']}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.sass.base));
});
