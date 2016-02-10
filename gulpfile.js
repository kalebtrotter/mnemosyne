var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var babel = require('gulp-babel');
var runsequence = require('run-sequence');
var argv = require('yargs').argv;
var shell = require('gulp-shell');

var src = {};


// REACT
src.react = ['js/react/src/*.js'];

gulp.task('react_jsx', function(){
	return gulp.src(src.react)
		// only pass through files that have changed
		.pipe($.newer('js/react/build'))
		.pipe($.plumber({
			handleError: function(err){
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(babel())
		.pipe(gulp.dest('js/react/build'));
});

// APP.JS
src.app = [
	'js/main.js',
	'js/react/build/*.js'
];

gulp.task('app_js', function(){
	return gulp.src(src.app)
		// concat
		.pipe($.concat('app.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build/js'))
		// minify
		.pipe($.if(argv.production, $.rename('app.min.js')))
		.pipe($.if(argv.production, $.uglify()))
		.pipe($.if(argv.production, gulp.dest('build/js')));
});


// ALL JS
gulp.task('js', function(cb){
	runsequence('react_jsx', 'app_js', cb);
});


// SASS
src.sass = [
	'css/*.scss'
];

gulp.task('sass', function(){
	return gulp.src(src.sass)
		// sassify (using libsass, not ruby sass)
		.pipe($.sass({errLogToConsole: true})) // this option effectively does the same as plumber for jsx
		// minify
		.pipe($.minifyCss({processImport: false})) // process css @imports in the browser, not here
		.pipe(gulp.dest('build/css'));
});


// WATCH
gulp.task('watch', ['default'], function(){
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.react, ['js']);
});


// DEFAULT
gulp.task('default', ['sass', 'js']);