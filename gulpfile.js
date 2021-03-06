const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const terser = require('gulp-terser');
const responsiveImages = require('gulp-responsive');
const browserSync = require('browser-sync').create();

const cleanCSSobj = {level: {
  2: {
    all: true
  }
}};
// Copy third party libraries from /node_modules into /vendor

function vendor(done) {
     // Bootstrap
     gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))
  
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

function create_responsive_img() {
  return gulp.src('./img/*.jpg')
  .pipe(responsiveImages({
    '*.jpg': [{
      width: 320,
      rename: {suffix: '-@1x'} 
    }, {
      width: 320 * 2,
      rename: {suffix: '-@2x'}
    }, {
      width: 320*2,
      rename: {suffix: '-@3x'}
    }, {
      width: 320 * 4,
      rename: {suffix: '-@4x'}
    }
  ]
  }))
  .pipe(gulp.dest('./img'));
}

function css_minify() {
  return gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS(cleanCSSobj))
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
  .pipe(terser())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./js'))
  .pipe(browserSync.stream());
}

function icomoon_minify() {
  return gulp.src([
    './vendor/icomoon/style.css'
  ])
  .pipe(cleanCSS())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./vendor/icomoon/'));
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
  let html_watch = gulp.watch('./*.html');
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

const js = gulp.series(js_minify);
const css = gulp.series(css_compile, css_minify);
const img = gulp.series(create_responsive_img);
const build = gulp.series(css, js, icomoon_minify, vendor);
const dev = gulp.series(build, gulp.parallel(watch, _browserSync));

exports.css = css;
exports.js = js;
exports.build = build;
exports.default = build;
exports.dev = dev;
exports.img = img;

