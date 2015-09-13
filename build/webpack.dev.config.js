///////////////////////////////////////////////////////////////////////////////
//
// Webpack development config
//
// article http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup
// article https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
// ref https://github.com/gpbl/isomorphic500/blob/master/webpack/dev.config.js
//
///////////////////////////////////////////////////////////////////////////////

let webpack = require('webpack');
let path    = require('path');
let { PROXY_PORT } = require('../constants');

let clientPath  = path.resolve(__dirname, '..', 'src');
let contextPath = path.resolve(__dirname, '..', 'src', 'js');
let distPath    = path.resolve(__dirname, '..', 'dist');
let nodeModules = path.resolve(__dirname, '..', 'node_modules');

module.exports = {

  context : contextPath,
  entry   : [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on hot updates
    `webpack-dev-server/client?http://localhost:${PROXY_PORT}`,

    // Entry file
    './client'

  ],

  output: {
    path       : distPath,
    filename   : 'bundle.js',
    publicPath : '/build/'
  },

  devtool: 'eval',

  module : {
    loaders: [
      {
        test    : /\.jsx?$/,
        exclude : nodeModules,
        include : [clientPath],
        loaders : ['babel']
      },
      {
        test   : /\.scss$/,
        // Adding sourceMap makes the file loader not work.
        loader : 'style!css!autoprefixer?browsers=last 3 version!sass'
      },
      {
        test: /\.jpe?g$/,
        loader: 'url?limit=5000'
      },
      {
        test: /\.gif$/,
        loader: 'url?limit=5000'
      },
      {
        test: /\.png$/,
        loader: 'url?limit=5000'
      },
      {
        test: /\.eot$/,
        loader: 'url?limit=5000'
      },
      {
        test: /\.svg$/,
        loader: 'url?limit=5000'
      },
      {
        test: /\.woff$/,
        loader: 'url?limit=5000'
      },
      {
        test: /\.ttf$/,
        loader: 'url?limit=5000'
      }
    ]
  },

  plugins : [
    new webpack.HotModuleReplacementPlugin()
  ]

};

///////////////////////////////////////////////////////////////////////////////
