const path = require('path');
const webpack = require('webpack');
// const  ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');  


module.exports = {

  mode: 'production',

  entry: {
    blocks: './client/js/blocks.js',
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js',
  },

  module: {
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:['babel-loader'],
      }
    ]
  },
};
