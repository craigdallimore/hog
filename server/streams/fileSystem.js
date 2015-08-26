///////////////////////////////////////////////////////////////////////////////
//
// Filesystem change stream
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

let { libraryPath } = require('../../config.json');
let { compose } = require('ramda');

let bacon    = require('baconjs');
let chokidar = require('chokidar');
let path     = require('path');
let { toPair } = require('../lib/helpers');

///////////////////////////////////////////////////////////////////////////////

//  :: String path
let libPath = path.join(__dirname, '..', '..', libraryPath);

//  :: String path
let cwd     = path.join(__dirname, '..', '..');

let watcher = chokidar.watch(libPath, {
  cwd,
  usePolling : true
});

//  :: Function sink -> Function binder
let fsChangeBinder = sink => watcher.on('all', compose(sink, toPair));

//  :: EventStream [event, path]
let fsChangeStream = bacon.fromBinder(fsChangeBinder);

//// EXPORTS //////////////////////////////////////////////////////////////////

export default fsChangeStream;

///////////////////////////////////////////////////////////////////////////////
