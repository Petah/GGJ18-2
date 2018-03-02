const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const expectFile = require('gulp-expect-file');
const sass = require('gulp-sass');

gulp.task('watch', ['default'], () => {
    gulp.watch('private/**', ['default']);
});

gulp.task('default', () => {
    // gulp.src([
    //     './node_modules/pixi.js/dist/pixi.min.js',
    //     './node_modules/pixi-particles/dist/pixi-particles.min.js',
    // ])
    //     .pipe(concat('vendor.js'))
    //     .pipe(gulp.dest('public'))

    // gulp.src('private/client/**/*.js')
    //     .pipe(babel({
    //         presets: ['env']
    //     }))
    //     .pipe(concat('game.js'))
    //     .pipe(gulp.dest('public'))
});
