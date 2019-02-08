var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

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

// gulp.task('vendor', gulp.series(function _vendor(done) {
//    // Bootstrap
//    gulp.src([
//     './node_modules/bootstrap/dist/**/*',
//     '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
//     '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
//   ])
//   .pipe(gulp.dest('./vendor/bootstrap'))

// // Font Awesome
// gulp.src([
//     './node_modules/font-awesome/**/*',
//     '!./node_modules/font-awesome/{less,less/*}',
//     '!./node_modules/font-awesome/{scss,scss/*}',
//     '!./node_modules/font-awesome/.*',
//     '!./node_modules/font-awesome/*.{txt,json,md}'
//   ])
//   .pipe(gulp.dest('./vendor/font-awesome'))

// // jQuery
// gulp.src([
//     './node_modules/jquery/dist/*',
//     '!./node_modules/jquery/dist/core.js'
//   ])
//   .pipe(gulp.dest('./vendor/jquery'))

// // jQuery Easing
// gulp.src([
//     './node_modules/jquery.easing/*.js'
//   ])
//   .pipe(gulp.dest('./vendor/jquery-easing'))


//   done();
// }));


function css_compile() {
  return gulp.src('./scss/**/*.scss')
  .pipe(sass.sync({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(gulp.dest('./css'))
}
// Compile SCSS
// gulp.task('css:compile', function() {
//   return gulp.src('./scss/**/*.scss')
//     .pipe(sass.sync({
//       outputStyle: 'expanded'
//     }).on('error', sass.logError))
//     .pipe(gulp.dest('./css'))
// });

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

// Minify CSS
// gulp.task('css:minify', gulp.series('css:compile'), function css_min () {
//   return gulp.src([
//       './css/*.css',
//       '!./css/*.min.css'
//     ])
//     .pipe(cleanCSS())
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest('./css'))
//     .pipe(browserSync.stream());
// });


// CSS
// gulp.task('css', gulp.series('css:compile', 'css:minify'));

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
// Minify JavaScript
// gulp.task('js:minify', function() {
//   return gulp.src([
//       './js/*.js',
//       '!./js/*.min.js'
//     ])
//     .pipe(uglify())
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest('./js'))
//     .pipe(browserSync.stream());
// });


// JS
// gulp.task('js', gulp.series('js:minify'));

// Default task

// gulp.task('default', gulp.series('css', 'js', 'vendor'));

function browserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}
// Configure the browserSync task
// gulp.task('browserSync', function _sync(done) {
//   browserSync.init({
//     server: {
//       baseDir: "./"
//     }
//   });
//   done();
// });

// Dev task
function dev() {
  build();
  gulp.watch('./js/*.js', gulp.series('js'));
  gulp.watch('./scss/*.scss', gulp.series('css'));
  gulp.watch('./*.html', gulp.series(browserSyncReload));
}


var js = gulp.series(js_minify);
var css = gulp.series(css_compile, css_minify);
var build = gulp.series(css, js, vendor);

exports.css = css;
exports.js = js;
exports.build = build;
exports.default = build;
exports.dev = dev;
// gulp.task('dev', gulp.series('css', 'js', 'browserSync'), function dev_ () {
//   var sass_watch = gulp.watch('./scss/*.scss', gulp.series('css', browserSync.reload()));
//   gulp.watch('./js/*.js', gulp.series('js', browserSync.reload()));
//   gulp.watch('./*.html', browserSync.reload());
//   sass_watch.on('all', function(event, path, stats) {
//     console.log('File ' + path + ' was ' + event + ', running tasks...');
//   })

// });
