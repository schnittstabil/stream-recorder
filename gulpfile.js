'use strict';
var gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    rimraf = require('rimraf'),
    scripts = ['**/*.js', '!node_modules/**', '!coverage/**'];

gulp.task('clean', rimraf.bind(null, 'coverage'));

gulp.task('lint', function() {
  return gulp.src(scripts)
      /* hint */
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'))
    /* jscs */
    .pipe(jscs());
});

gulp.task('coverage', ['clean'], function(done) {
  gulp.src(scripts.concat(['!test.js']))
    .pipe(istanbul())
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function() {
      /* tests */
      gulp.src(['test.js'])
        .pipe(mocha({
          reporter: 'dot'
        }))
        .pipe(istanbul.writeReports({
          reporters: ['lcovonly', 'text-summary', 'html']
        }))
        .on('end', done);
    });
});

gulp.task('default', ['lint', 'coverage']);
