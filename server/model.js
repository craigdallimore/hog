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
let { compose, init, reduce, last } = require('ramda');
let libraryChangeStream   = require('./files');

///////////////////////////////////////////////////////////////////////////////

let library = mori.hashMap('library', mori.hashMap('children', mori.hashMap()));

///////////////////////////////////////////////////////////////////////////////

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

//  :: Array -> Array
let interleaveChildren = compose(init, reduce((acc, segment) => acc.concat([segment, 'children']), []));

//  :: EventStream [String] -- A stream of folder path lists
let addDirSegmentStream = libraryChangeStream
  .filter(addDirPredicate)
  .map(last)
  .map(pathToPathList)
  .map(interleaveChildren);

//  :: EventStream [String] -- A stream of new file paths
let addFilePathStream = libraryChangeStream
  .filter(addFilePredicate)
  .map(last);

//  :: EventStream [String path, {stats}]
let addFileStatsStream = addFilePathStream.flatMap(filePath => {

  let statStream     = Bacon.fromNodeCallback(fs.stat, path.join(__dirname, filePath));
  let filePathStream = Bacon
    .constant(filePath)
    .map(pathToPathList)
    .map(interleaveChildren);

  return filePathStream.zip(statStream, (xs, stat) => [xs, { stat, filePath }]);

});

//  :: EventStream [String] -- A stream of folder path lists
let rmDirSegmentStream = libraryChangeStream
  .filter(rmDirPredicate)
  .map(last)
  .map(pathToPathList)
  .map(interleaveChildren);

//  :: EventStream [String] -- A stream of new file paths
let rmFileSegmentStream = libraryChangeStream
  .filter(rmFilePredicate)
  .map(last)
  .map(pathToPathList)
  .map(interleaveChildren);

//  :: Object, [String] -> Object
let addDirectory = (lib, xs) => {

  let dir = mori.hashMap('children', mori.hashMap());

  if (!mori.getIn(lib, xs)) {
    return mori.assocIn(lib, xs, dir);
  }

  return lib;

};

//  :: Object, [[String], {file}] -> Object
let addFile = (lib, [xs, file]) => {

  if (!mori.getIn(lib, xs)) {
    return mori.assocIn(lib, xs, file);
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
  [addDirSegmentStream], addDirectory,
  [addFileStatsStream], addFile,
  [rmFileSegmentStream], deleteAt,
  [rmDirSegmentStream], deleteAt
);

//// EXPORTS //////////////////////////////////////////////////////////////////

module.exports = libStream.map(x => mori.toJs(x));

///////////////////////////////////////////////////////////////////////////////
