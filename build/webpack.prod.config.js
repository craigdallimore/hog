///////////////////////////////////////////////////////////////////////////////
//
// Webpack prod config
//
// article http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup
// article https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
// ref https://github.com/gpbl/isomorphic500/blob/master/webpack/dev.config.js
//
///////////////////////////////////////////////////////////////////////////////

let path    = require('path');
let webpack = require('webpack');

let ExtractTextPlugin = require('extract-text-webpack-plugin');

let clientPath  = path.resolve(__dirname, '..', 'src');
let contextPath = path.resolve(__dirname, '..', 'src', 'js');
let distPath    = path.resolve(__dirname, '..', 'dist');
let nodeModules = path.resolve(__dirname, '..', 'node_modules');

module.exports = {

  context : contextPath,
  entry   : [

    // Entry file
    './client'

  ],

  output: {
    path       : distPath,
    filename   : 'bundle.js'
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
        loader : ExtractTextPlugin.extract('style!css?sourceMap!autoprefixer?browsers=last 3 version!sass')
      }
    ]
  },
  plugins : [
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.UglifyJsPlugin()
  ]

};

///////////////////////////////////////////////////////////////////////////////
