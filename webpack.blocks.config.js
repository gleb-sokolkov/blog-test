const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
// const  ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');  


module.exports = {
  entry: {
    blocks: './client/js/blocks.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js',
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.ProvidePlugin({}),
  ],
};
