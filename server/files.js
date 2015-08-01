///////////////////////////////////////////////////////////////////////////////
//
// Library change stream
//
///////////////////////////////////////////////////////////////////////////////

/* jshint quotmark:false */
'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let { compose } = require('ramda');

let bacon    = require('baconjs');
let chokidar = require('chokidar');
let path     = require('path');
let { toPair } = require('./lib/helpers');

///////////////////////////////////////////////////////////////////////////////

//  :: String path
let libPath = path.join(__dirname, '../library');

let watcher = chokidar.watch(libPath, {
  cwd        : __dirname,
  usePolling : true
});

//  :: Function sink -> Function binder
let directoryChangeBinder = sink => watcher.on('all', compose(sink, toPair));

//  :: EventStream [event, path]
let directoryChangeStream = bacon.fromBinder(directoryChangeBinder);

//// EXPORTS //////////////////////////////////////////////////////////////////

module.exports = directoryChangeStream;

///////////////////////////////////////////////////////////////////////////////
