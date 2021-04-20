const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

const webpackProdConfig = merge(webpackBaseConfig, {
    mode: 'production',
});

module.exports = webpackProdConfig;