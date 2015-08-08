///////////////////////////////////////////////////////////////////////////////
//
// Development bundling
//
// ref http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

let Webpack          = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let webpackConfig    = require('../webpack.config');

let path = require('path');

// TODO why this?
let fs   = require('fs');

// TODO why this?
let mainPath = path.resolve(__dirname, '..', 'src', 'js', 'client.js');

module.exports = () => {

  // Pass configuration to webpack
  let bundleStart = null;
  let compiler    = Webpack(webpackConfig);

  // Log when bundling starts
  compiler.plugin('compile', () => {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  // Log when bundling ends
  compiler.plugin('done', () => {
    let message = `Bundling completed in ${ Date.now() - bundleStart } ms`;
    console.log(message);
  });

  let config = {

    // We need to tell Webpack to serve our bundled application
    // from the build path. When proxying:
    // http://localhost:3000/build -> http://localhost:8080/build
    publicPath : '/build/',
    hot        : true,

    // Terminal config
    quiet  : false,
    noInfo : true,
    stats : {
      colors : true
    }

  };

  let bundler = new WebpackDevServer(compiler, config);

  bundler.listen(8080, 'localhost', () => {
    console.log('Bundling project, please wait');
  });

};

///////////////////////////////////////////////////////////////////////////////
