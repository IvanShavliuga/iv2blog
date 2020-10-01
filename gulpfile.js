const gulp = require('gulp');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const sync = require('browser-sync');
const replace = require('gulp-replace');
// HTML

const html = () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

exports.html = html;
const styles = () => {
    return gulp.src('src/styles/index.css')
        .pipe(replace(/\.\.\//g, ''))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

exports.styles = styles;

// Scripts
const scripts = () => {
    return gulp.src('src/scripts/index.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

exports.scripts = scripts;

// Copy

const copy = () => {
    return gulp.src([
            'src/fonts/**/*',
            'src/images/**/*',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};

exports.copy = copy;

// Paths

const paths = () => {
    return gulp.src('dist/*.html')
        .pipe(replace(
            /(<link rel="stylesheet" href=")styles\/(index.css">)/, '$1$2'
        ))
        .pipe(replace(
            /(<script src=")scripts\/(index.js">)/, '$1$2'
        ))
        .pipe(gulp.dest('dist'));
};

exports.paths = paths;

// Server

const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
};

exports.server = server;

// Watch

const watch = () => {
    gulp.watch('src/*.html', gulp.series(html, paths));
    gulp.watch('src/styles/**/*.css', gulp.series(styles));
    gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/fonts/**/*',
        'src/images/**/*',
    ], gulp.series(copy));
};

exports.watch = watch;

// Default

exports.default = gulp.series(
    gulp.parallel(
        html,
        styles,
        scripts,
        copy,
    ),
    paths,
    gulp.parallel(
        watch,
        server,
    ),
);
