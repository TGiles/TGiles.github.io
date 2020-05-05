const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const terser = require('gulp-terser');
const responsiveImages = require('gulp-responsive');
const browserSync = require('browser-sync').create();
const fs = require('fs');

const cleanCSSobj = {
  level: {
    2: {
      all: true
    }
  }
};
// Copy third party libraries from /node_modules into /dist/vendor

function vendor(done) {
  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ])
    .pipe(gulp.dest('./dist/vendor/bootstrap'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest('./dist/vendor/jquery'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ])
    .pipe(gulp.dest('./dist/vendor/jquery-easing'))

  done();
}

function copy_resume_background(done) {
  gulp.src('./img/background.png')
    .pipe(gulp.dest('./dist/img'));
  done();
}

function copy_src_files(done) {
  gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
  gulp.src('./web-resume.html')
    .pipe(gulp.dest('./dist'));
  gulp.src('./favicon (1).png')
    .pipe(gulp.dest('./dist'));
  done();
}

function clean_dist(done) {
  fs.rmdir('./dist', {recursive: true}, (e) => {
    if (e) {
      throw e;
    }
    done();
  })
}

function css_compile() {
  return gulp.src('./scss/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(cleanCSS(cleanCSSobj))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
}

function resume_styles_compile() {
  return gulp.src('./css/style.css')
  .pipe(cleanCSS(cleanCSSobj))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('./dist/css'));
}

function create_responsive_img() {
  return gulp.src('./img/*.jpg')
    .pipe(responsiveImages({
      '*.jpg': [{
        width: 320,
        rename: { suffix: '-@1x' }
      }, {
        width: 320 * 2,
        rename: { suffix: '-@2x' }
      }, {
        width: 320 * 3,
        rename: { suffix: '-@3x' }
      }, {
        width: 320 * 4,
        rename: { suffix: '-@4x' }
      }
      ]
    }))
    .pipe(gulp.dest('./dist/img'));
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
    .pipe(gulp.dest('./dist/js'))
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
    .pipe(gulp.dest('./dist/vendor/icomoon/'));
}

function _browserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  done();
}

function _browserSyncReload() {
  browserSync.reload();
}

function watch() {
  let js_watch = gulp.watch('./js/*.js');
  let scss_watch = gulp.watch('./scss/*.scss', gulp.series(css_compile));
  let html_watch = gulp.watch('./*.html', gulp.series(copy_src_files));
  js_watch.on('change', function () {
    js_minify();
  });
  scss_watch.on('change', function () {
    console.log('scss_watch');
    _browserSyncReload();
  });
  html_watch.on('change', () => {
    _browserSyncReload();
  });
}

const js = gulp.series(js_minify);
const source = gulp.series(copy_src_files);
const css = gulp.series(css_compile, resume_styles_compile);
const img = gulp.series(copy_resume_background, create_responsive_img);
const build = gulp.series(clean_dist, source, css, js, icomoon_minify, vendor, img);
const dev = gulp.series(build, gulp.parallel(watch, _browserSync));
const clean = gulp.series(clean_dist);

exports.css = css;
exports.js = js;
exports.build = build;
exports.default = build;
exports.dev = dev;
exports.img = img;
exports.clean = clean;

