///////////////////////////////////////////////////////////////////////////////
//
// Library change stream
//
///////////////////////////////////////////////////////////////////////////////

/* jshint quotmark:false */
'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let bacon              = require('baconjs');
let chokidar           = require('chokidar');
let path               = require('path');
let { curry, compose } = require('ramda');
let { toPair }         = require('./lib/helpers');

///////////////////////////////////////////////////////////////////////////////

//  :: String path -> function sink -> Function binder
//let watchBinder = curry((path, sink) => fs.watch(path, compose(sink, toPair)));

//  :: String path
let libPath = path.join(__dirname, '../library');

//  :: String path -> Function sink -> Function binder
let directoryChangeBinder = curry((dirPath, sink) => {
  chokidar.watch(dirPath, { cwd: __dirname }).on('all', compose(sink, toPair));
});

//  :: EventStream [event, path]
let directoryChangeStream = new bacon.fromBinder(directoryChangeBinder(libPath));

//// EXPORTS //////////////////////////////////////////////////////////////////

module.exports = directoryChangeStream;

///////////////////////////////////////////////////////////////////////////////
