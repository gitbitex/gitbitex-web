module.exports = function (isProduction, buildPath) {

    return {
        'base': {
            'vendor.script': {
                type: 'concat',
                src: [
                    'node_modules/moment/min/moment-with-locales.js',
                    'node_modules/collect.js/build/collect.js',
                    'node_modules/qrcodejs/qrcode.js',
                    'node_modules/highcharts/highstock.js',
                    'node_modules/highcharts/indicators/indicators.js',
                    'node_modules/highcharts/indicators/ema.js'
                ],
                encrypt_js: isProduction,
                file: 'base.js',
                build: buildPath + 'assets/script/'
            },
            'app.script': {
                type: 'webpack',
                src: './src/script/main.ts',
                file: 'app.js',
                build: buildPath + 'assets/script/',
                watch: './src/script/**/*'
            },
            'vendor.style': {
                type: 'concat',
                src: [
                
                ],
                encrypt_css: isProduction,
                file: 'base.css',
                build: buildPath + 'assets/style/'
            },
            'app.style': {
                type: 'less',
                src: './src/style/app.less',
                file: 'app.css',
                build: buildPath + 'assets/style/',
                encrypt_css: isProduction,
                watch: './src/style/**/*'
            },
            'app.index': {
                type: 'concat',
                encrypt_html: isProduction,
                src: './src/index.html',
                file: 'index.html',
                build: buildPath
            },
            'app.font': {
                type: 'copy',
                src: './src/font/**/*',
                build: buildPath + 'assets/font/'
            },
            'app.image': {
                type: 'copy',
                src: './src/image/**/*',
                build: buildPath + 'assets/image/'
            },
            'app.chart': {
                type: 'copy',
                src: './src/charting-library/**/*',
                build: buildPath + 'assets/charting-library/'
            }
        },
        "prod": {
            "vendor.script.md5": {
                type: 'md5',
                page:  buildPath + 'index.html',
                pageBuild: buildPath,
                src: [
                    buildPath + 'assets/script/base.js'
                ],
                concat: "vendor.js",
                build:  buildPath + 'assets/script/'
            },
            "app.script.md5": {
                type: 'md5',
                page:  buildPath + 'index.html',
                pageBuild: buildPath + '/',
                src: [
                    buildPath + 'assets/script/app.js'
                ],
                concat: "main.js",
                build:  buildPath + 'assets/script/'
            },
            "app.style.md5": {
                type: 'md5',
                page:  buildPath + 'index.html',
                pageBuild: buildPath,
                src: [
                    buildPath + 'assets/style/*.css'
                ],
                build:  buildPath + 'assets/style/'
            },
            "app.md5.clean": {
                type: "clean",
                src: [
                    buildPath + 'assets/script/base.js',
                    buildPath + 'assets/script/base.js.map',
                    buildPath + 'assets/script/app.js',
                    buildPath + 'assets/script/app.js.map',
                    buildPath + 'assets/style/base.css',
                    buildPath + 'assets/style/app.css',
                ]
            }
        }
    }
}
