///////////////////////////////////////////////////////////////////////////////
//
// Model
//
///////////////////////////////////////////////////////////////////////////////

/* jshint quotmark:false */
'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let Bacon                 = require('baconjs');
let fs                    = require('fs');
let path                  = require('path');
let mori                  = require('mori');
let { curry, init, last } = require('ramda');
let { toPair }            = require('./lib/helpers');
let libraryChangeStream   = require('./files');

//// DATA STRUCTURE ///////////////////////////////////////////////////////////

let library = mori.hashMap();

///////////////////////////////////////////////////////////////////////////////

//  :: a -> b -> [a, b]
let curriedToPair = curry(toPair);

//  :: [String] -> Boolean
let addDirPredicate = ([action]) => action === 'addDir';

//  :: [String] -> Boolean
let rmDirPredicate = ([action]) => action === 'unlinkDir';

//  :: [String] -> Boolean
let addFilePredicate = ([action]) => action === 'add';

//  :: [String] -> Boolean
let rmFilePredicate = ([action]) => action === 'unlink';

//  :: String -> Array -- Turn a path into an array of directory names.
let pathToPathList = x => x.replace('../', '').split('/');

//  :: EventStream [String] -- A stream of folder path lists
let newPathListStream = libraryChangeStream
  .filter(addDirPredicate)
  .map(last)
  .map(pathToPathList);

//  :: EventStream [String] -- A stream of folder path lists
let rmPathListStream = libraryChangeStream
  .filter(rmDirPredicate)
  .map(last)
  .map(pathToPathList);

//  :: EventStream [String] -- A stream of new file paths
let newFilePathStream = libraryChangeStream
  .filter(addFilePredicate)
  .map(last);

//  :: EventStream [String] -- A stream of new file paths
let rmFilePathStream = libraryChangeStream
  .filter(rmFilePredicate)
  .map(last)
  .map(pathToPathList);

//  :: String -> EventStream
let pathToStatStream = filePath => {
  return Bacon.fromNodeCallback(fs.stat, path.join(__dirname, filePath)).map(curriedToPair(filePath));
};

//  :: EventStream [String path, {stats}]
let statsStream = newFilePathStream.flatMap(pathToStatStream);

//  :: EventStream [String, {Stats}]
//  -- A stream of lists made up of path segment and a filename
let newFileStream = statsStream.map(([filePath, stats]) => [pathToPathList(filePath), stats]);

//  :: Object, [String] -> Object
let addDirectory = (lib, xs) => {

  if (!mori.getIn(lib, xs)) {
    return mori.assocIn(lib, xs, mori.hashMap());
  }

  return lib;

};

//  :: Object, [[String], {stats}] -> Object
let addFile = (lib, [xs, stats]) => {

  if (!mori.getIn(lib, xs)) {
    return mori.assocIn(lib, xs, stats);
  }

  return lib;

};

//  :: Object, [String] -> Object
let deleteAt = (lib, xs) => {

  if (mori.getIn(lib, xs)) {
    return mori.updateIn(lib, init(xs), (o) => {
      return mori.dissoc(o, last(xs));
    });
  }

  return lib;

};

// Starting with the immutable library, create a stream of the library data
// structure as directories and files are added.
let libStream = Bacon.update(library,
  [newPathListStream], addDirectory,
  [newFileStream], addFile,
  [rmFilePathStream, rmPathListStream], deleteAt
);

//// EXPORTS //////////////////////////////////////////////////////////////////

module.exports = libStream;

///////////////////////////////////////////////////////////////////////////////
