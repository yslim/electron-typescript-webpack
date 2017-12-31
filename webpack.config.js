const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const optimize = webpack.optimize;

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVELOPMENT = process.env.NODE_ENV === 'development';

const plugins = PRODUCTION ?
   [
      new optimize.UglifyJsPlugin()
   ] :
   [
   ];

plugins.push(
   new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(DEVELOPMENT),
      PRODUCTION: JSON.stringify(PRODUCTION)
   }),
   new ExtractTextPlugin('style-[contenthash:10].css')
);

const commonConfig = {
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: 'ts-loader'
         },
         {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: 'css-loader'
             })
         }
      ]
   },
   resolve: {
      extensions: ['.js', 'jsx', '.ts', 'tsx', '.json', '.css']
   },
   node: {
      __dirname: false
   },
   watch: false
};

module.exports = [
   Object.assign(
      {
         target: 'electron-main',
         entry: { main: './src/main/main.ts' },
         plugins: plugins
      },
      commonConfig),
   Object.assign(
      {
         target: 'electron-renderer',
         entry: { app: './src/renderer/app.ts' },
         plugins: [
            new CopyWebpackPlugin([
               { from: 'src/assets', to: 'assets' },
               { context: 'src', from: 'logo.*' },
               { from: 'package.json' }
            ]),
            new HtmlWebpackPlugin({
               template: './src/renderer/index.html'
            })
         ].concat(plugins)
      },
      commonConfig)
];