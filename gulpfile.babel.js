const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const prefixer = require('gulp-autoprefixer');
const babel = require('babel-core');
const glob = require('gulp-sass-glob');
const gutil = require('gulp-util');
const webpack = require('webpack');
const concat = require('gulp-concat');

import { webpackScripts } from './webpack.config';

gulp.task('scripts', function() {
  webpack(webpackScripts, function(err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }
    gutil.log("[webpack]", stats.toString({
      chunks: false,
      colors: true,
      errorDetails: true
    }));
  })
});

gulp.task('style', function() {
  return gulp.src('app/**/*.scss')
    .pipe(concat('main.scss'))
    .pipe(plumber())
    .pipe(glob())
    .pipe(sass())
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('markup', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('app/**/*.jsx', ['scripts']);
  gulp.watch('app/**/*.scss', ['style']);
  gulp.watch('app/*.html', ['markup']);
});

