const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const del = require('del')
const gulp = require('gulp')
const gulpBabel = require('gulp-babel')
const gulpConcat = require('gulp-concat')
const gulpHtmlmin = require('gulp-htmlmin')
const gulpPostcss = require('gulp-postcss')
const gulpRename = require('gulp-rename')
const gulpSass = require('gulp-sass')
const gulpUglify = require('gulp-uglify')
const gulpZip = require('gulp-zip')

function taskClean () {
  return del(['build/*', 'dist/*'])
}

function copyManifest () {
  return gulp.src('src/manifest.json')
    .pipe(gulp.dest('build'))
}

function copyDevTools () {
  return gulp.src('src/devtools/*')
    .pipe(gulp.dest('build/devtools'))
}

function copyContentScripts () {
  return gulp.src('src/content-scripts/*.js')
    .pipe(gulp.dest('build/content-scripts'))
}

function copyImages () {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('build/images'))
}

function compileHtml () {
  return gulp.src('src/panel/index.html')
    .pipe(gulpHtmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulpRename('index.html'))
    .pipe(gulp.dest('build/panel'))
}

function compileStyles () {
  return gulp.src('src/panel/styles/*.scss')
    .pipe(gulpSass())
    .pipe(gulpPostcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(gulpRename('bundle.css'))
    .pipe(gulp.dest('build/panel'))
}

function compileVendorScripts () {
  return gulp.src('src/panel/scripts/vendors/*.js')
    .pipe(gulpUglify())
    .pipe(gulpConcat('vendors.js'))
    .pipe(gulp.dest('build/panel'))
}

function compileScripts () {
  const scripts = [
    'src/panel/scripts/Utils.js',
    'src/panel/scripts/RequestFilter.js',
    'src/panel/scripts/Request.js',
    // 'src/panel/scripts/AdobeAnalytics.js',
    // 'src/panel/scripts/GoogleAnalytics.js',
    'src/panel/scripts/TealiumIQ.js',
    'src/panel/scripts/index.js'
  ]
  return gulp.src(scripts)
    .pipe(gulpBabel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulpUglify())
    .pipe(gulpConcat('bundle.js'))
    .pipe(gulp.dest('build/panel'))
}

const taskBuild = gulp.series(
  taskClean,
  copyManifest,
  copyDevTools,
  copyContentScripts,
  copyImages,
  compileHtml,
  compileStyles,
  compileVendorScripts,
  compileScripts
)

function taskWatch () {
  return gulp.watch('src/**/*', taskBuild)
}

function createDistributionFile () {
  return gulp.src('build/**/*')
    .pipe(gulpZip('tealman.zip'))
    .pipe(gulp.dest('dist'))
}

const taskRelease = gulp.series(taskBuild, createDistributionFile)

exports.clean = taskClean
exports.build = taskBuild
exports.watch = taskWatch
exports.release = taskRelease

exports.default = taskBuild