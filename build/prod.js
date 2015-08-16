///////////////////////////////////////////////////////////////////////////////
//
// Production build
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

let webpack        = require('webpack');
let webpackConfig  = require('./webpack.prod.config');

module.exports = () => {

  let compiler = webpack(webpackConfig);
  let bundleStart = null;

  compiler.plugin('compile', () => {
    console.log('Production bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    var message = `Bundling completed in ${Date.now() - bundleStart}  ms`;
    console.log(message);
  });

  compiler.run(err => {
    if (err) { console.error(err); }
  });

};

///////////////////////////////////////////////////////////////////////////////
