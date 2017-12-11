var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var ts = require("gulp-typescript");
var watchify = require("watchify");
var gutil = require("gulp-util");
var tsProject = ts.createProject("tsconfig.json");
var paths = {
    pages: ["src/*html"]
}
gulp.task("copy-html",function(){
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
})
//将browserify实例包裹在watchify的调用里，控制生成的结果
var watchedBrowserify = watchify(browserify({
    basedir: ".",
    debug: true,
    entries: ['src/index.ts'],
    cache: {},
    packageCache: {}
})).plugin(tsify)//每次改变index.ts文件时  都会执行 watchedBrowserify
function bundle () {
    return watchedBrowserify
    .bundle()
    .pipe(source("index.js"))
    .pipe(gulp.dest("dist"))
}
// gulp.task("default", ["copy-html"],function () {
//以下代码可以在node环境下运行，不能在浏览器下运行 因为使用了es6的语法
    // return tsProject.src()
    //     .pipe(tsProject())
    //     .js.pipe(gulp.dest("dist"));、

// 用tsify和browerify将es6转化为es5 并且指定了在调试的时候  打断点的是ts文件
    // return browserify({
    //     basedir: ".",
    //     debug: true, //让tsify输出文件里生成source maps(允许我们在浏览器中直接调试Typescript源码);
    //     entries: ['src/index.ts'],
    //     cache: {},
    //     packageCache: {}
    // })
    // .plugin(tsify)
    // .bundle()
    // .pipe(source('index.js'))
    // .pipe(gulp.dest("dist"))

//作用：自动刷新代码、压缩代码、将es5以上的代码转变成es3/5
// });
gulp.task("default",["copy-html"],bundle);
watchedBrowserify.on("update",bundle);//每次改变browserify文件时 都会执行bundle函数
watchedBrowserify.on("log",gutil.log)
