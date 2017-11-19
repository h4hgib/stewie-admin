var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    pug         = require('gulp-pug'),
    //uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    data        = require('gulp-data'),
    fs          = require('fs');

// Server
gulp.task('browserSync', function() {
    browserSync({
        server : {
            baseDir : './www'
        },
        options : {
            reloadDelay : 250
        },
        notify : false
    });
});

// SASS/SCSS
gulp.task('styles', function() {
    gulp.src('./src/scss/fonts/**')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./www/css/fonts'))
        .pipe(browserSync.reload({
          stream: true
        }));

    return gulp.src('./src/scss/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./www/css'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// HTML
gulp.task('html', function() {
    return gulp.src('./src/templates/*.pug')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(pug({}))
        .pipe(gulp.dest('./www'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// JS
gulp.task('js', function() {
    gulp.src(['./src/js/app.js', './src/js/validate.min.js'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        //.pipe(uglify())
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./www/js'));

    gulp.src(['./src/js/chart.js'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        //.pipe(uglify())
        .pipe(concat('chart.js'))
        .pipe(gulp.dest('./www/js'));

    return gulp.src(['./src/js/admin.js'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        //.pipe(uglify())
        .pipe(concat('admin.js'))
        .pipe(gulp.dest('./www/js'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// api
gulp.task('api', function() {
    return gulp.src('./src/api/**/*')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./www/api'));
});

// images
gulp.task('img', function() {
    return gulp.src('./src/images/**')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./www/images'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// Run the app
gulp.task('build', ['styles','html','js','api','img','browserSync'], function() {
    gulp.watch('./src/scss/*.scss', ['styles']);
    gulp.watch('./src/templates/**', ['html']);
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/api/**/*', ['api']);
    gulp.watch('./src/img/**', ['img']);
});
