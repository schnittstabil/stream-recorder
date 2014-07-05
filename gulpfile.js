'use strict';
var gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    scripts = ['**/*.js', '!node_modules/**', '!coverage/**'];

gulp.task('lint', function() {
  return gulp.src(scripts)
      /* hint */
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'))
    /* jscs */
    .pipe(jscs());
});

gulp.task('coverage', function (done) {
  gulp.src(scripts.concat(['!test.js']))
    .pipe(istanbul())
    .on('finish', function () {
      /* tests */
      gulp.src(['test.js'])
        .pipe(mocha({
          reporter: 'dot'
        }))
        .pipe(istanbul.writeReports({
          reporters: ['lcovonly', 'text-summary']
        }))
        .on('end', done);
    });
});

gulp.task('default', ['lint', 'coverage']);
