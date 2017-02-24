const gulp = require('gulp');
const babel = require('gulp-babel');
const socket = require('socket.io-client');

gulp.task('js', function() {
    return gulp.src(['./src/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('serve', ['js'], function() {
    var scom = require('./dist/index.js')
    var config = {
        "log_level" : "info",
        "port" : 8001,
        "base" : "./dist",
    };
    scom.default.start(config);
    return true;
});

const mocha = require('gulp-mocha');

gulp.task('tests', ['js'],  () =>
    gulp.src('./test/tests.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
);

gulp.task('demo',  () =>
    gulp.src('./test/demo.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
);

gulp.task('newdb',  () =>
    gulp.src('./test/newdb.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
);
