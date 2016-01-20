'use strict';

import config from '../config';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import handleErrors from '../util/handleErrors';
import browserSync from 'browser-sync';
import cssnano from 'gulp-cssnano';
import concat from 'gulp-concat';

gulp.task('vendor-styles', function() {
  const createSourcemap = !global.isProd || config.styles.prodSourcemap;

  return gulp.src(config.vendor.css.src)
    .pipe(gulpif(createSourcemap, sourcemaps.init()))
    .pipe(cssnano())
    .on('error', handleErrors)
    .pipe(concat(config.vendor.css.name))
    .pipe(gulpif(
      createSourcemap,
      sourcemaps.write(global.isProd ? './' : null)
    ))
    .pipe(gulp.dest(config.vendor.css.dest))
    .pipe(browserSync.stream());
});
