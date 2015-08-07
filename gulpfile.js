'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

var paths = {
	css: './public/css/',
	sass: './public/sass/**/*.scss'
};

gulp.task('default', ['watch', 'sass']);

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass']);
});

gulp.task('sass', function() {
	gulp.src(paths.sass)
		.pipe(sass({
				outputStyle: 'compressed'
			})
			.on('error', function(err) {
				console.error('Error!', err.message);
			}))
		.pipe(gulp.dest(paths.css))
		.pipe(connect.reload())
});