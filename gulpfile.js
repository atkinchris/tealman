const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const del = require('del')
const gulp = require('gulp')
const gulpBabel = require('gulp-babel');
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

function taskManifest () {
  return gulp.src('src/manifest.json')
    .pipe(gulp.dest('build'))
}

function taskDevTools () {
  return gulp.src('src/devtools/*')
    .pipe(gulp.dest('build/devtools'))
}

function taskHtml () {
  return gulp.src('src/panel/index.html')
    .pipe(gulpHtmlmin({collapseWhitespace: true}))
    .pipe(gulpRename('index.html'))
    .pipe(gulp.dest('build/panel'))
}

function taskStyles () {
  return gulp.src('src/panel/styles/*.scss')
    .pipe(gulpSass())
    .pipe(gulpPostcss([autoprefixer(), cssnano()]))
    .pipe(gulpRename('bundle.css'))
    .pipe(gulp.dest('build/panel'))
}

function taskVendorScripts () {
  return gulp.src('src/panel/scripts/vendors/*.js')
    .pipe(gulpUglify())
    .pipe(gulpConcat('vendors.js'))
    .pipe(gulp.dest('build/panel'))
}

function taskScripts () {
  return gulp.src([
      'src/panel/scripts/Utils.js',
      'src/panel/scripts/Hit.js',
      'src/panel/scripts/GoogleAnalytics.js',
      'src/panel/scripts/TealiumIQ.js',
      'src/panel/scripts/RequestFilter.js',
      'src/panel/scripts/index.js'
    ])
    .pipe(gulpBabel({
      plugins: ['@babel/plugin-proposal-class-properties'],
      presets: ['@babel/preset-env']
    }))
    .pipe(gulpUglify())
    .pipe(gulpConcat('bundle.js'))
    .pipe(gulp.dest('build/panel'))
}

function taskContentScripts () {
  return gulp.src('src/content-scripts/*.js')
    .pipe(gulp.dest('build/content-scripts'))
}

function taskImages () {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('build/images'))
}

const taskBuild = gulp.series(
  taskClean,
  taskManifest,
  taskDevTools,
  taskHtml,
  taskStyles,
  taskVendorScripts,
  taskScripts,
  taskContentScripts,
  taskImages
)

function taskWatch () {
  return gulp.watch('src/**/*', taskBuild)
}

function taskZip () {
  return gulp.src('build/**/*')
    .pipe(gulpZip('tealman.zip'))
    .pipe(gulp.dest('dist'))
}

const taskRelease = gulp.series(taskBuild, taskZip)

exports.clean = taskClean
exports.build = taskBuild
exports.watch = taskWatch
exports.release = taskRelease

exports.default = taskBuild