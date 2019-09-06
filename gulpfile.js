const del = require('del')
const gulp = require('gulp')

const paths = {
  build: 'build',
  src: 'src',
}

function taskClean () {
  return del([
    `${paths.build}/*`
  ])
}

function taskCopyAssetsRoot () {
  return gulp.src([
    `${paths.src}/devtoolspage.html`,
    `${paths.src}/devtoolspage.js`,
    `${paths.src}/icon-128.png`,
    `${paths.src}/manifest.json`
  ]).pipe(gulp.dest(`${paths.build}`))
}

const build = gulp.series(taskClean, taskCopyAssetsRoot)

exports.clean = taskClean

exports.build = build

exports.default = build