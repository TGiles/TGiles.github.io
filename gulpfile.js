var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Copy third party libraries from /node_modules into /vendor

function vendor(done) {
     // Bootstrap
     gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))
  
  // Font Awesome
  gulp.src([
      './node_modules/font-awesome/**/*',
      '!./node_modules/font-awesome/{less,less/*}',
      '!./node_modules/font-awesome/{scss,scss/*}',
      '!./node_modules/font-awesome/.*',
      '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./vendor/font-awesome'))
  
  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))
  
  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))
  
    done();
}
function css_compile() {
  return gulp.src('./scss/*.scss')
  .pipe(sass.sync({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(gulp.dest('./css'))
}


function css_minify() {
  return gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}

function js_minify() {
  return gulp.src([
    './js/*.js',
    '!./js/*.min.js'
  ])
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./js'))
  .pipe(browserSync.stream());
}

function _browserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

function _browserSyncReload() {
  browserSync.reload();
}

function watch() {
  let js_watch = gulp.watch('./js/*.js');
  let scss_watch = gulp.watch('./scss/*.scss', gulp.series(css_compile, css_minify));
  let html_watch = gulp.watch('./*.html')
  js_watch.on('change', function() {
    js_minify();
  });
  scss_watch.on('change', function() {
    console.log('scss_watch');
    _browserSyncReload();
  });
  html_watch.on('change', () => {
    _browserSyncReload();
  });
}

var js = gulp.series(js_minify);
var css = gulp.series(css_compile, css_minify);
var build = gulp.series(css, js, vendor);
var dev = gulp.series(build, gulp.parallel(watch, _browserSync));

exports.css = css;
exports.js = js;
exports.build = build;
exports.default = build;
exports.dev = dev;

