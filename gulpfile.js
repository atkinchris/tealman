const del = require('del')
const gulp = require('gulp')
const gulpZip = require('gulp-zip')

const paths = {
  build: 'build',
  dist: 'dist',
  release: 'tealman.zip',
  src: 'src',
}

function clean () {
  return del([
    `${paths.build}/*`,
    `${paths.dist}/*`
  ])
}

function copyRootAssets () {
  return gulp.src([
    `${paths.src}/devtoolspage.html`,
    `${paths.src}/devtoolspage.js`,
    `${paths.src}/icon-128.png`,
    `${paths.src}/manifest.json`
  ]).pipe(gulp.dest(`${paths.build}`))
}

function zip () {
  return gulp.src(`${paths.build}/*`)
    .pipe(gulpZip(`${paths.release}`))
    .pipe(gulp.dest(`${paths.dist}`))
}

const build = gulp.series(clean, copyRootAssets)
const release = gulp.series(build, zip)

exports.clean = clean
exports.build = build
exports.release = release

exports.default = build