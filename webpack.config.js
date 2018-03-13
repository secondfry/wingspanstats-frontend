const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob')

const extractScss = new ExtractTextPlugin('css/vue.css');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: './src/js/app.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          loaders: {
            scss: extractScss.extract(['css-loader', 'sass-loader', {
              loader: 'sass-resources-loader',
              options: {
                resources: path.resolve(__dirname, './src/sass/_inject.scss')
              }
            }]),
          }
        }
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: '/images/'
            }  
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([
      'dest/css/vue*',
      'dest/images',
      'dest/js',
    ]),
    extractScss
  ],
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dest')
  },
  externals: {
    axios: 'axios',
    localforage: 'localforage',
    moment: 'moment',
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter'
  }
};
