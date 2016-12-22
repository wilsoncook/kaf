var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./tsconfig.json');
var mocha = require('gulp-mocha');

//clean-build
gulp.task('clean-build', function() {
	return gulp.src('./build', { read: false })
		.pipe(clean());
});
//build
gulp.task('build', ['clean-build'], function() {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest('./build'));
});

//test
gulp.task('test', ['build'], function() {
	return gulp.src('./build/tests/**/*.js')
		.pipe(mocha());
});