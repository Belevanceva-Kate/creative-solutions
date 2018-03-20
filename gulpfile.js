var gulp = require('gulp'),
	watch = require('gulp-watch'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync'),
	rimraf = require('gulp-rimraf'),
	include = require('gulp-include');

var path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { 
        html: 'src/*.html', 
        js: 'src/js/bootstrap.js',
        style: 'src/scss/bootstrap.scss',
        img: 'src/img/*.*', 
        fonts: 'src/fonts/*.*'
    },
    watch: { 
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/*.*',
        fonts: 'src/fonts/*.*'
    },
    clean: './build'
};


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        // tunnel: true
    });
});

gulp.task('js', function(){
	// clear(path.build.js);
	return gulp.src(path.src.js)
		.pipe(rigger())// собираем в один файл в нужном порядке
		// .pipe(sourcemaps.init())
		.pipe(uglify()) // сжимаем
		.pipe(rename({
			basename: 'scripts',
			suffix: '.min',
			extname: ".js"
		})) // переименовать
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js)) // сохранить
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
	// clear(path.build.css);
	return gulp.src(path.src.style)
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename({
			basename: 'styles',
			extname: ".css"
		}))
		.pipe(gulp.dest(path.build.css))
});

gulp.task('min-css', ['css'], function(){
	return gulp.src(path.build.css + 'styles.css')
		.pipe(cssmin())
		.pipe(rename({
			basename: 'styles',
			suffix: '.min',
			extname: ".css"
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('img', function(){
	// clear(path.build.img);
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('min-img', function(){
	// clear(path.build.img);
	return gulp.src(path.src.img)
		.pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		]))
		.pipe(gulp.dest(path.build.img))
});

gulp.task('html', function(){
	return gulp.src(path.src.html)
		// .pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts', function(){
	// clear(path.build.fonts);
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('clear', function(cb) {
 	rimraf(path.clean, cb);
});

// function clear(path) {
// 	gulp.src(path, { read: false })
//    .pipe(rimraf());
// };


gulp.task('build', [
	'html',
	'min-css',
	'fonts',
	'img',
	'js'
]);

// gulp.task('clear', function (cb) {
//     rimraf(path.clean, cb);
// });

gulp.task('watch', ['browser-sync'], function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html');
	})
	watch([path.watch.img], function(event, cb) {
		gulp.start('img');
	})
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts');
	})
	watch([path.watch.style], function(event, cb) {
		gulp.start('min-css');
	})
	watch([path.watch.js], function(event, cb) {
		gulp.start('js');
	})
});

gulp.task('default', ['build', 'watch', 'browser-sync']);

