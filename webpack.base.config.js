const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PATHS = {
    src: path.resolve(__dirname, "client"),
    dst: path.resolve(__dirname, "public"),
};

module.exports = {
    externals: {
        paths: PATHS,
    },
    entry: {
        shared: path.join(PATHS.src, 'js/shared'),
        vendor: ['font-awesome/scss/font-awesome.scss', 'bootstrap/dist/js/bootstrap.bundle', path.join(PATHS.src, 'js/polyfills')],
    },
    output: {
        path: PATHS.dst,
        filename: 'js/[name].bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            //babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            //static-images
            {
                test: /\.(?:ico|git|png|jpg|jpeg)$/,
                type: 'asset/resource',
            },
            //fonts
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
                type: 'asset/inline',
            },
            //postcss, css, sass
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
            new OptimizeCssAssetsPlugin(),
        ],
    },
};