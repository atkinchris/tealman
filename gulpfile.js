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

const directories = {
  build: 'build',
  buildPanel: 'build/panel',
  dist: 'dist',
  src: 'src',
  srcPanel: 'src/panel'
}
const paths = {
  html: {
    src: `${directories.srcPanel}/index.html`,
    output: 'index.html',
    dest: directories.buildPanel
  },
  styles: {
    src: `${directories.srcPanel}/styles/*.scss`,
    output: 'bundle.css',
    dest: directories.buildPanel
  },
  scripts: {
    src: [
      `${directories.srcPanel}/scripts/RequestFilter.js`,
      `${directories.srcPanel}/scripts/Request.js`,
      `${directories.srcPanel}/scripts/index.js`
    ],
    output: 'bundle.js',
    dest: directories.buildPanel,
    vendors: {
      src: `${directories.srcPanel}/scripts/vendors/*.js`,
      output: 'vendors.js',
      dest: directories.buildPanel
    }
  },
  releaseOutput: 'tealman.zip'
}

function taskClean () {
  return del([
    `${directories.build}/*`,
    `${directories.dist}/*`
  ])
}

function copyRootAssets () {
  return gulp.src([
    `${directories.src}/devtoolspage.html`,
    `${directories.src}/devtoolspage.js`,
    `${directories.src}/icon-128.png`,
    `${directories.src}/manifest.json`
  ]).pipe(gulp.dest(directories.build))
}

function html () {
  return gulp.src(paths.html.src)
    .pipe(gulpHtmlmin({collapseWhitespace: true}))
    .pipe(gulpRename(paths.html.output))
    .pipe(gulp.dest(paths.html.dest))
}

function styles () {
  return gulp.src(paths.styles.src)
    .pipe(gulpSass())
    .pipe(gulpPostcss([autoprefixer(), cssnano()]))
    .pipe(gulpRename(paths.styles.output))
    .pipe(gulp.dest(paths.styles.dest))
}

function copyVendorScripts () {
  return gulp.src(paths.scripts.vendors.src)
    .pipe(gulpUglify())
    .pipe(gulpConcat(paths.scripts.vendors.output))
    .pipe(gulp.dest(paths.scripts.vendors.dest))
}

function scripts () {
  return gulp.src(paths.scripts.src)
    .pipe(gulpBabel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulpUglify())
    .pipe(gulpConcat(paths.scripts.output))
    .pipe(gulp.dest(paths.scripts.dest))
}

const taskBuild = gulp.series(taskClean, copyRootAssets, html, styles, copyVendorScripts, scripts)

function taskWatch () {
  return gulp.watch(`${directories.srcPanel}/**/*`, taskBuild)
}

function zip () {
  return gulp.src(`${directories.build}/*`)
    .pipe(gulpZip(paths.releaseOutput))
    .pipe(gulp.dest(directories.dist))
}

const taskRelease = gulp.series(taskBuild, zip)

exports.clean = taskClean
exports.build = taskBuild
exports.watch = taskWatch
exports.release = taskRelease

exports.default = taskBuild