var gulp = require('gulp');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

require('gulp-release-tasks')(gulp);

gulp.task('clean', function() {
    return gulp.src('dist/**/*', { read: false })
        .pipe(clean());
});

gulp.task('uglify', function() {
	return gulp.src('src/*.js')
	// This will output the non-minified version
	.pipe(gulp.dest('dist'))
	// This will minify and rename to foo.min.js
	.pipe(uglify())
	.pipe(rename({ extname: '.min.js' }))
	.pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
	runSequence('clean', 'uglify');
});
