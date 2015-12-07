/*!
 *
 * $ npm install
 * $ gulp
 * $ gulp watch
 */

// Load pluginsconst
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cache = require('gulp-cache');
const scsslint = require('gulp-scss-lint');

const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const _ = require('lodash');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const buffer = require('vinyl-buffer');
const debowerify = require('debowerify');

var config = {
  cleanOutputDir: './../dist/',
  scriptsOutputDir: './../dist/scripts/',
  stylesOutputDir: './../dist/styles/',
  imagesOutputDir: './../dist/images/',

  outputFile: 'app.js',

  watchJsFilesMask: ['js/*.js', 'js/*/*.js'],
  entryFile: 'js/app.js',

  watchSassFilesMask: ['sass/*/*.scss', 'sass/*.scss'],
  compileSassFilesMask: ['sass/*.scss'],

  libsCssFilesMask: ['libs/*.css'],
  libsJsFilesMask: ['libs/*.js'],
  libsOutputCssFile: 'libs.css',
  libsOutputJsFile: 'libs.js',

  imagesMask: ['images/*'],
};

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
}
function bundle() {
  return getBundler()
    .transform(babelify)
    .transform(debowerify)
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err.message, err);
    })

    .pipe(source(config.outputFile))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scriptsOutputDir))
    .pipe(reload({ stream: true }))
    // uglify
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.scriptsOutputDir))
    .pipe(reload({ stream: true }));
}


// clean the scripts output directory
gulp.task('clean', function(cb) {
  rimraf(config.cleanOutputDir, cb);
});
gulp.task('build-persistent', function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['default'], function() {

  browserSync({
    open: false,
    server: {
      baseDir: '../'
    },
    socket: {
      domain: 'localhost:3000'//,
      //port: 3000,
      //namespace: function (namespace) {
      //  return "localhost:3000" + namespace;
      //}
    },
    port: 3000
  });
  gulp.watch(config.watchSassFilesMask, ['styles']);
  gulp.watch(config.libsJsFilesMask, ['libs-scripts']);
  gulp.watch(config.libsCssFilesMask, ['libs-styles']);
  gulp.watch(config.imagesMask, ['images']);
  getBundler().on('update', function() {
    console.log('update event');
    gulp.start('build-persistent');
    gulp.start('scripts-lint');
  });
});

// Styles
gulp.task('styles', function() {


    return gulp.src(config.compileSassFilesMask)
      .pipe(scsslint())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(autoprefixer('last 2 version'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.stylesOutputDir))
      .pipe(browserSync.stream())
      .pipe(reload({ stream: true }))
      // minify
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.stylesOutputDir))
      .pipe(browserSync.stream())
      .pipe(reload({ stream: true }));

});

gulp.task('scripts-lint', function() {
    return gulp.src(config.watchJsFilesMask)
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format());
});


// Libraries - scripts
gulp.task('libs-scripts', function() {
    return gulp.src(config.libsJsFilesMask)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(config.libsOutputJsFile))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.scriptsOutputDir))
        .pipe(browserSync.stream())
        .pipe(reload({ stream: true }))
        // minify
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.scriptsOutputDir))
        .pipe(browserSync.stream())
        .pipe(reload({ stream: true }));
});

gulp.task('libs-styles', function() {
    return gulp.src(config.libsCssFilesMask)
        .pipe(sourcemaps.init())
        .pipe(concat(config.libsOutputCssFile))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.stylesOutputDir))
        .pipe(browserSync.stream())
        .pipe(reload({ stream: true }))
        // minify
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.stylesOutputDir))
        .pipe(browserSync.stream())
        .pipe(reload({ stream: true }));
});

// Images
gulp.task('images', function() {
    return gulp.src(config.imagesMask)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(config.imagesOutputDir))
        .pipe(browserSync.stream());
});


// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'build-persistent', 'images', 'libs-styles', 'libs-scripts', 'scripts-lint');
});

