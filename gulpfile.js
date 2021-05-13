const { src, dest, series, parallel, watch } = require('gulp')
const del = require('del')
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')

// Define
const origin = 'src'
const destination = 'build'

// Delete Build Folder
async function clean(cb) {
  await del(destination)
  cb()
}

// HTML
function html() {
  return src(`${origin}/**/*.html`).pipe(dest(destination))
}

// CSS
function css(cb) {
  src(`${origin}/css/**/*`).pipe(dest(`${destination}/css`))
  cb()
}

// JS
function js(cb) {
  src(`${origin}/js/lib/**/*`).pipe(dest(`${destination}/js/lib`))
  src(`${origin}/js/script.js`).pipe(dest(`${destination}/js`))
  cb()
}

// Image
function img() {
  return src(`${origin}/images/**/*`).pipe(dest(`${destination}/images`))
}

function watcher(cb) {
  watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
  watch(`${origin}/**/*.css`).on('change', series(css, browserSync.reload))
  watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
  watch(`${origin}/img/**/*`).on('change', series(img, browserSync.reload))
  cb()
}

function server(cb) {
  browserSync.init({
    notify: false,
    open: true,
    server: {
      baseDir: destination,
    },
  })
  cb()
}

exports.default = series(clean, parallel(html, css, js, img), server, watcher)
