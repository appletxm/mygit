var gulp = require('gulp'),
    notify = require('gulp-notify'),
    jade = require('gulp-jade'),
    connect = require('gulp-connect'),
	open = require('gulp-open');
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    //autoprefixer = require('gulp-autoprefixer'),
    autoprefixer = require('less-plugin-autoprefix'),
    copy = require('gulp-copy'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),

    webpack = require('webpack'),
    webpackConfig = require("./webpack.config.js"),

    path = require('path');


//【内部调用函数】控制台错误处理
function handleErrors (error) {
    var args = Array.prototype.slice.call(arguments);

    if(!error){
        notify.onError({
            title : 'compile error',
            message : '<%=error.message %>'
        }).apply(this, args);//替换为当前对象

        this.emit();//提交
    }else{
        console.error('************handleErrors************');
        console.error(error);
    }

    /*notify.onError({
        title : 'compile error',
        message : '<%=error.message %>'
    }).apply(this, args);//替换为当前对象

    this.emit();//提交*/
}

gulp.task('connect', function () {
    connect.server({
        root: './dist/',
        host: '192.168.69.191', //if you want use the ip to load web it should be set like 19.168.90.9
        port: 8000,
        livereload: true
    });
});


gulp.task('open', function(){
	var options = {
		uri: '192.168.69.191:8000',
		app: 'chrome'
	};
	gulp.src('')
	.pipe(open(options));
});

/*
gulp.task('open', function () {
  var options = {
    url: 'http://localhost:9000'
  };

  gulp.src('./dist/index.html') //this must be a valid and existing path.
    .pipe(open('<%file.path%>', options));
});
*/

gulp.task('copy:dev', function () {
    var stream = gulp.src(['./src/assets/**/*', './src/bin/**/*'])
        .pipe(copy('./dev/', {
            prefix : 1
        }));

    return stream;
});

gulp.task('copy:dist', function () {
    var stream = gulp.src(['./src/assets/**/*', './src/bin/**/*'])
        .pipe(copy('./dist/', {
            prefix : 1
        }));

    return stream;
});

gulp.task('clean:dev', function(){
    var stream = gulp.src(['dev/**/*'])
        .pipe(clean())
        .on("error", handleErrors);
    return stream;
});

gulp.task('clean:dist', function(){
    var stream = gulp.src(['dist/**/*'])
        .pipe(clean())
        .on("error", handleErrors);
    return stream;
});

gulp.task('less:dev', function () {
    var autoPrefixerPlugin = new autoprefixer({ browsers: ['last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'] });
    var stream = gulp.src(['./src/styles/exits/*.less'])
        .pipe(less({
            plugins: [autoPrefixerPlugin]
        }))
        .on("error", handleErrors)
        .pipe(gulp.dest('dev/styles/'));

    return stream;
});

gulp.task('less:dist', function () {
    var stream = gulp.src(['dev/styles/*.css'])
        .pipe(rename({suffix: '.min'}))
        .on('error', handleErrors)
        .pipe(minifycss())
        .on('error', handleErrors)
        .pipe(gulp.dest('dist/styles/'));

    return stream;
});

gulp.task('jade', function(){
    var YOUR_LOCALS = {};
    var stream = gulp.src(['./src/views/exits/*.jade'])
    .pipe(jade({
        locals: YOUR_LOCALS,
        pretty: true
    }))
    .on("error", handleErrors)
    .pipe(gulp.dest('./dev/'));

    return stream;
});

gulp.task('jade:dist', function(){
    var YOUR_LOCALS = {};
    var stream = gulp.src('./src/views/exits/index-dist.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .on("error", handleErrors)
        .pipe(gulp.dest('./dist/'));

    return stream;
});

gulp.task('webpack', function(){
    var myConfig = Object.create(webpackConfig);

    webpack(myConfig, function(err, stats) {
        // if(err) throw new gutil.PluginError("webpack", err);
        // gutil.log("[webpack]", stats.toString({
        //	 // output options
        // }));

        if(err){
            handleErrors(err);
        }
    });
});

gulp.task('uglify:dist', function(){
    var stream = gulp.src(['dev/**/*.js'])
        .pipe(rename({suffix: '.min'}))
        .on('error', handleErrors)
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest('dist/'));

    return stream;
});

gulp.task('watch:less', function(){
    gulp.watch('src/styles/**/*.less', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running less tasks...');
        gulp.start('less:dev');
    });
});

gulp.task('watch:jade', function(){
    gulp.watch('src/views/**/*.jade', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running jade tasks...');
        gulp.start('jade');
    });
});

gulp.task('watch:js', function(){
    gulp.watch('src/scripts/**/*.js', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running webpack tasks...');
        gulp.start('webpack');
    });
});

gulp.task('watch', function(){
    gulp.start('watch:less', 'watch:jade', 'watch:js');
});

gulp.task('default', function () {
    //gulp.start('less:dev', 'webpack', 'jade', 'copy:dev', 'watch', 'connect');
    gulp.start('less:dev', 'webpack', 'jade', 'copy:dev', 'watch');
});

gulp.task('release', function () {
    gulp.start('clean:dist','less:dist', 'uglify:dist', 'jade:dist', 'copy:dist');
});

gulp.task('myapp', function () {
    gulp.start('connect', 'open');
});


