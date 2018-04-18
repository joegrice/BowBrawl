const webpackConfig = require('./webpack.test.config.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        reporters: ['progress'],
        port: 8081,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS2'],
        phantomjsLauncher: {
            exitOnResourceError: true
        },
        singleRun: false,
        autoWatchBatchDelay: 300,
        client: {
            clearContext: false
        },
        files: [
            './src/**/*.spec.ts',
            './public/dist/phaser.min.js',
            './public/dist/socket.io.js',
        ],
        preprocessors: {
            './src/**/*.ts': ['webpack']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: {
                chunk: false
            }
        },
        mime: {
            'text/x-typescript': ['ts']
        },
    });
};
