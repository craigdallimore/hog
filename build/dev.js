///////////////////////////////////////////////////////////////////////////////
//
// Development bundling
//
// ref http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

let webpack          = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let webpackConfig    = require('./webpack.dev.config');

let path = require('path');

module.exports = (PROXY_PORT) => {

  // Pass configuration to webpack
  let bundleStart = null;
  let compiler    = webpack(webpackConfig);

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
    // http://localhost:<PORT>/build -> http://localhost:<PROX_PORT>/build
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

  bundler.listen(PROXY_PORT, 'localhost', () => {
    console.log('Bundling project, please wait');
  });

};

///////////////////////////////////////////////////////////////////////////////
