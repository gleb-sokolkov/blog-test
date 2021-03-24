const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

var appConfig = {

    devtool: 'source-map',

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        publicPath: '/',
        compress: true,
        port: 9000,
        watchContentBase: true,
    },

    entry: {
        shared: path.resolve(__dirname, "client/js/shared.js"),
    },

    output: {
        path: path.resolve(__dirname, "public"),
        filename: "js/[name].bundle.js",
        publicPath: '/',
    },


    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],

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
            //postcss, sass, css
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

    optimization: {
        minimize: true,
        minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
    },
};

var faConfig = {

    entry: {
        fa: path.resolve(__dirname, 'node_modules/font-awesome/scss/font-awesome.scss'),
    },

    output: {
        path: path.resolve(__dirname, "public"),
        filename: "js/[name].bundle.js",
        publicPath: '/',
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],

    module: {
        rules: [
            //fonts
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
                type: 'asset/inline',
            },
            //css sass
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

    optimization: {
        minimize: true,
        minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
    },
};

var bootstrapConfig = {

    entry: {
        bootstrap: path.resolve(__dirname, "node_modules/bootstrap/dist/js/bootstrap.bundle"),
    },

    output: {
        path: path.resolve(__dirname, "public"),
        filename: "js/[name].bundle.js",
        publicPath: "/",
    },
};

module.exports = [appConfig, faConfig, bootstrapConfig];