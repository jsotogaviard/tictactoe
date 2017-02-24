const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const watchify = require('watchify');
const paths = require('./paths.js')();


gulp.task('watch-js', function() {

    var bundle = browserify()
        .add(paths.src.js.app)
        .transform(babelify, {presets: ['es2015', 'react']});

    var watcher = watchify(bundle);

    return watcher
        .on('update', function () {
            var updateStart = Date.now();
            console.log('Updating!');
            watcher.bundle()
                .pipe(source(paths.dist.js.app_name))
                .pipe(gulp.dest(paths.dist.js.base));
            console.log('Updated!', (Date.now() - updateStart) + 'ms');
        })
        .bundle()
        .pipe(source(paths.dist.js.app_name))
        .pipe(gulp.dest(paths.dist.js.base));
});