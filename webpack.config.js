const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const optimize = require('webpack').optimize;

const isProd = process.env.NODE_ENV === 'production';

const plugins = isProd ?
   [
      new optimize.UglifyJsPlugin()
   ] :
   [
   ];

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
         }
      ]
   },
   resolve: {
      extensions: ['.js', 'jsx', '.ts', 'tsx', '.json']
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
         entry: { main: './src/main.ts' },
         plugins: plugins
      },
      commonConfig),
   Object.assign(
      {
         target: 'electron-renderer',
         entry: { gui: './src/gui.ts' },
         plugins: [
            new HtmlWebpackPlugin({
               title: 'Mail Alarm'
            }),
            new CopyWebpackPlugin([
               { from: 'src/assets', to: 'assets' },
               { context: 'src', from: 'logo.*' },
               { from: 'package.json' }
            ])
         ].concat(plugins)
      },
      commonConfig)
];