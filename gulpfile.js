const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const del = require('del')
const gulp = require('gulp')
const gulpConcat = require('gulp-concat')
const gulpHtmlmin = require('gulp-htmlmin')
const gulpPostcss = require('gulp-postcss')
const gulpRename = require('gulp-rename')
const gulpSass = require('gulp-sass')
const gulpUglify = require('gulp-uglify')
const gulpZip = require('gulp-zip')

const paths = {
  build: 'build',
  dist: 'dist',
  releaseOutput: 'tealman.zip',
  src: 'src'
}
paths.buildPanel = `${paths.build}/panel`
paths.html = {
  src: `${paths.src}/panel/index.html`,
  output: 'index.html'
}
paths.styles = {
  src: `${paths.src}/panel/styles/*.scss`,
  output: 'bundle.css'
}
paths.scripts = {
  src: `${paths.src}/panel/scripts/*.js`,
  output: 'bundle.js',
  vendors: {
    src: `${paths.src}/panel/scripts/vendors/*.js`,
    output: 'vendors.js'
  }
}

function clean () {
  return del([
    `${paths.build}`,
    `${paths.dist}`
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

function html () {
  return gulp.src(paths.html.src)
    .pipe(gulpHtmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.buildPanel))
}

function styles () {
  return gulp.src(paths.styles.src)
    .pipe(gulpSass())
    .pipe(gulpPostcss([autoprefixer(), cssnano()]))
    .pipe(gulpRename(paths.styles.output))
    .pipe(gulp.dest(paths.buildPanel))
}

function copyVendorScripts () {
  return gulp.src(paths.scripts.vendors.src)
    .pipe(gulpUglify())
    .pipe(gulpConcat(paths.scripts.vendors.output))
    .pipe(gulp.dest(paths.buildPanel))
}

function zip () {
  return gulp.src(`${paths.build}/*`)
    .pipe(gulpZip(`${paths.releaseOutput}`))
    .pipe(gulp.dest(`${paths.dist}`))
}

const build = gulp.series(clean, copyRootAssets, html, styles, copyVendorScripts)
const release = gulp.series(build, zip)

exports.clean = clean
exports.build = build
exports.release = release

exports.default = build