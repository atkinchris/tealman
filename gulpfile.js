const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const del = require('del')
const gulp = require('gulp')
const gulpPostcss = require('gulp-postcss')
const gulpRename = require('gulp-rename')
const gulpSass = require('gulp-sass')
const gulpZip = require('gulp-zip')

const paths = {
  build: 'build',
  dist: 'dist',
  release: 'tealman.zip',
  src: 'src'
}
paths.styles = {
  src: `${paths.src}/panel/styles/*.scss`,
  output: 'bundle.css',
  dest: `${paths.build}/panel`,
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

function styles () {
  return gulp.src(paths.styles.src)
    .pipe(gulpSass())
    .pipe(gulpPostcss([autoprefixer(), cssnano()]))
    .pipe(gulpRename(paths.styles.output))
    .pipe(gulp.dest(paths.styles.dest))
}

function zip () {
  return gulp.src(`${paths.build}/*`)
    .pipe(gulpZip(`${paths.release}`))
    .pipe(gulp.dest(`${paths.dist}`))
}

const build = gulp.series(clean, copyRootAssets, styles)
const release = gulp.series(build, zip)

exports.clean = clean
exports.build = build
exports.release = release

exports.default = build