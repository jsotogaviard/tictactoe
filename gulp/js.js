const gulp = require('gulp');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const paths = require('./paths.js')();

var gutil = require('gulp-util');

gulp.task('js', function() {
    return browserify()
        .add(paths.src.js.app)
        .transform(babelify, {presets: ['es2015', 'react']})
        .on('error', gutil.log)
        .bundle()
        .on('error', gutil.log)
        .pipe(source(paths.dist.js.app_name))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js.base));
});
