// Copyright 2019 GitBitEx.com
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var gulp = require('gulp'),
    webpack = require('webpack'),
    minimist = require('minimist'),
    proxy = require('http-proxy-middleware'),
    plugins = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    history = require('connect-history-api-fallback'),
    del = require('del');

options = minimist(process.argv.slice(2));
isProduction = options.env == 'prod';
buildPath = './build/web';
routeBase = '/';
apiProxy = 'https://gitbitex.com:8080/';

function createTask(task, taskName) {
    if (task.type == 'concat') {
        (function (task, taskName) {
            var cleanTaskName = taskName + '.clean';
            var runTaskName = taskName + '.run';
            gulp.task(cleanTaskName, function () {
                return gulp.src(task.build + task.file).pipe(plugins.clean({ force: true }));
            })

            var htmlMinOptions = {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                minifyCSS: true   
            }

            gulp.task(runTaskName, function () {
                return gulp.src(task.src)
                    .pipe(plugins.concat(task.file))
                    .pipe(plugins.if(task.encrypt_js, plugins.uglify()))
                    .pipe(plugins.if(task.encrypt_css, plugins.minifyCss()))
                    .pipe(plugins.if(task.encrypt_html, plugins.htmlmin(htmlMinOptions)))
                    .pipe(gulp.dest(task.build))
            })
            return gulp.task(taskName, [cleanTaskName, runTaskName], function () {
                browserSync.reload();
            })
        })(task, taskName)
    }
    else if (task.type == 'copy') {
        (function (task, taskName) {
            var cleanTaskName = taskName + '.clean';
            gulp.task(cleanTaskName, function () {
                return gulp.src(task.build).pipe(plugins.clean({ force: true }));
            })
            return gulp.task(taskName, [cleanTaskName], function () {
                return gulp.src(task.src).pipe(gulp.dest(task.build))
            })
        })(task, taskName)
    }
    else if (task.type == 'less') {
        (function (task, taskName) {
            var cleanTaskName = taskName + '.clean';
            var runTaskName = taskName + '.run';
            gulp.task(cleanTaskName, function () {
                return gulp.src(task.build + task.file).pipe(plugins.clean({ force: true }));
            })
            gulp.task(runTaskName, function () {
                return gulp.src(task.src)
                    .pipe(plugins.less())
                    .pipe(plugins.concat(task.file))
                    .pipe(gulp.dest(task.build))
            })
            gulp.task(taskName, [cleanTaskName, runTaskName], function () {
                browserSync.reload();
            })
        })(task, taskName)

    }
    else if (task.type == 'webpack') {
        (function (task, taskName) {
            return gulp.task(taskName, function (callback) {
                webpack(require("./gulp/webpack.config.js")(task, isProduction), function () {
                    browserSync.reload();
                    callback();
                });
            })
        })(task, taskName)
    }
    else if (task.type == 'clean') {
        (function (task, taskName) {
            return gulp.task(taskName, function () {
                return gulp.src(task.src).pipe(plugins.clean({ force: true }));
            });
        })(task, taskName)
    }
    else if (task.type == 'md5') {
        (function (task, taskName) {
            var taskRev = taskName + ".rev",
                taskReplace = taskName + ".replace",
                taskClean = taskName + ".clean",
                manifestName = taskName + ".rev.json";
            gulp.task(taskRev, function () {
                var pipe = gulp.src(task.src).pipe(plugins.rev()).pipe(gulp.dest(task.build))
                    .pipe(plugins.rev.manifest()).pipe(plugins.rename(manifestName)).pipe(gulp.dest(task.build));

                return pipe;
            });
            gulp.task(taskReplace, function () {
                var files = require(task.build + manifestName);
                var pipe = gulp.src(task.page);
                for (var file in files) {
                    console.log(task.page, file, files[file], task.pageBuild);
                    pipe.pipe(plugins.replace(file, files[file]));
                }
                pipe.pipe(gulp.dest(task.pageBuild));
                return pipe;
            });
            gulp.task(taskClean, function () {
                return gulp.src([
                    task.build + "/*.rev.json"
                ]).pipe(plugins.clean({ force: true }));
            });
        })(task, taskName)
    }
}

var tasks = [];

gulp.task('browser-sync', function () {
    browserSync.init({
        startPath: routeBase,
        server: {
            baseDir: buildPath,
            middleware: [proxy('/api', {
                target: apiProxy,
                changeOrigin: true,
                logLevel: 'debug',
            }), history({
                rewrites: [
                    {
                        from: new RegExp( "/^" + routeBase + "assets/(.*)$", "gi"),
                        to: function(context) {
                            return routeBase + 'assets/' + context.match[1]
                        }
                    },
                    {
                        from: new RegExp( "/^" + routeBase + "(.*)$", "gi"),
                        to: routeBase + 'index.html'
                    }
                    
                ]
            })]
        }
    });
});
tasks.push('browser-sync');

var config = require('./gulp/gulp.config')(isProduction, buildPath + routeBase);

for (var key in config["base"]) {
    var task = config["base"][key];
    var taskName = "base." + key;
    createTask(task, taskName);
    gulp.watch(task.watch || task.src, [taskName])
    tasks.push(taskName);
}

for (var key in config["prod"]) {
    var task = config["prod"][key],
        taskName = key;
    createTask(task, taskName);
}

resourcePath = buildPath + routeBase

gulp.task('clean', function () {
    return gulp.src([ resourcePath ]).pipe(plugins.clean({ force: true }));
});
gulp.task('clean-assets', function () {
    return gulp.src([ resourcePath + 'assets/']).pipe(plugins.clean({ force: true }));
});


gulp.task("default", ['clean'], function() {
    if(isProduction) {
        return runSequence(tasks, 
        "vendor.script.md5.rev", "vendor.script.md5.replace", "vendor.script.md5.clean",
        "app.script.md5.rev", "app.script.md5.replace", "app.script.md5.clean",
        "app.style.md5.rev", "app.style.md5.replace", "app.style.md5.clean", 
        "app.md5.clean")
    }
    else return runSequence(tasks);
});