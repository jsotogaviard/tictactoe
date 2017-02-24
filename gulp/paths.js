
module.exports = function() {
    return {
        src: {
            base : './src',
            js : {
                base : './src/js',
                app : './src/js/app.js'
            },
            less : {
                base : './src/less/*.less',
                app : './src/less/app.less'
            },
            sass : {
                base : './src/sass/*.scss',
                app : './src/sass/app.scss'
            },
            img : './src/img/*',
            fonts : './node_modules/bootstrap-sass/assets/fonts/bootstrap/*'
        },
        dist : {
            base : './dist',
            js : {
                base : './dist/js',
                app : './dist/js/app.js',
                app_name : 'app.js'
            },
            less : {
                base : './dist/css',
                app : './dist/css/app.css',
                app_name : 'app.css'
            },
            sass : {
                base : './dist/css',
                app : './dist/css/app.css',
                app_name : 'app.css'
            },
            img : './dist/img',
            fonts : './dist/fonts/bootstrap'
        },
        intl : './src/intl/*.json'
    };
};
