///////////////////////////////////////////////////////////////////////////////
//
// Webpack development config
//
// article http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup
// article https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
// ref https://github.com/gpbl/isomorphic500/blob/master/webpack/dev.config.js
//
///////////////////////////////////////////////////////////////////////////////

let Webpack = require('webpack');
let path    = require('path');

let clientPath  = path.resolve(__dirname, '..', 'src');
let contextPath = path.resolve(__dirname, '..', 'src', 'js');
let distPath    = path.resolve(__dirname, '..', 'dist');

module.exports = {

  context : contextPath,
  entry   : [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on hot updates
    'webpack-dev-server/client?http://localhost:8080',

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
        exclude : '/node_modules/',
        include : [clientPath],
        loaders : ['babel']
      },
      {
        test   : /\.scss$/,
        loader : 'style!css?sourceMap!autoprefixer?browsers=last 3 version!sass'
      }
    ]
  },

  plugins : [
    //new ExtractTextPlugin('bundle.css'),
    new Webpack.HotModuleReplacementPlugin()
  ]

};

///////////////////////////////////////////////////////////////////////////////
