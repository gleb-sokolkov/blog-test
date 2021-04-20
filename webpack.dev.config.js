const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const webpackDevConfig = merge(webpackBaseConfig, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: webpackBaseConfig.externals.paths.dst,
        publicPath: '/',
        compress: true,
        port: 9000,
        watchContentBase: true,
    },
});

module.exports = webpackDevConfig;