const gulp = require('gulp');
const stylus = require('gulp-stylus');
const plumber = require('gulp-plumber');

function compilarStyl() {
  return gulp.src('src/style.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('dist')); // Pasta de destino para o arquivo compilado
}

function assistir() {
  gulp.watch('src/style.styl', compilarStyl);
}

exports.default = gulp.series(compilarStyl, assistir);
