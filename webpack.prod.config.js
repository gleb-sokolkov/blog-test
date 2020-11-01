const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')


module.exports = {

    mode: 'production',

    entry: {
        shared: path.resolve(__dirname, "client/js/shared.js")
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