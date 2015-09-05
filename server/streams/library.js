///////////////////////////////////////////////////////////////////////////////
//
// Library
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import Bacon from 'baconjs';
import fs from 'fs';
import mori from 'mori';
import { compose, split, replace, init, reduce, last } from 'ramda';
import { libraryPath } from '../../config.json';
import { LIBRARY_NAME } from '../../constants';
import fsChangeStream from './fileSystem';

///////////////////////////////////////////////////////////////////////////////

const library = mori.hashMap(LIBRARY_NAME, mori.hashMap('children', mori.hashMap()));

///////////////////////////////////////////////////////////////////////////////

//  :: [String] -> Boolean
let addDirPredicate = ([action]) => action === 'addDir';

//  :: [String] -> Boolean
let rmDirPredicate = ([action]) => action === 'unlinkDir';

//  :: [String] -> Boolean
let addFilePredicate = ([action]) => action === 'add';

//  :: [String] -> Boolean
let rmFilePredicate = ([action]) => action === 'unlink';

//  :: Object stat -> Object file
let statToFile = stat => {

  return {
    filePath : stat.filePath.replace(libraryPath, LIBRARY_NAME),
    changed  : stat.ctime,
    modified : stat.mtime,
    accessed : stat.atime
  };

};

//  :: String -> Array -- Turn a path into an array of directory names.
let pathToPathList = compose(
  split('/'),
  x => LIBRARY_NAME + x,
  replace(libraryPath, '')
);

//  :: Array -> Array
let interleaveChildren = compose(init, reduce((acc, segment) => acc.concat([segment, 'children']), []));

//  :: EventStream [String] -- A stream of folder path lists
let addDirSegmentStream = fsChangeStream
  .filter(addDirPredicate)
  .map(last)
  .map(pathToPathList)
  .map(interleaveChildren);

//  :: EventStream [String] -- A stream of new file paths
let addFilePathStream = fsChangeStream
  .filter(addFilePredicate)
  .map(last);

//  :: EventStream [String path, {stats}]
let addFileStatsStream = addFilePathStream.flatMap(filePath => {

  let statStream     = Bacon.fromNodeCallback(fs.stat, filePath);
  let filePathStream = Bacon
    .constant(filePath)
    .map(pathToPathList)
    .map(interleaveChildren);

  return filePathStream.zip(statStream, (xs, stat) => [xs, Object.assign(stat, { filePath })]);

});

//  :: EventStream [String] -- A stream of folder path lists
let rmDirSegmentStream = fsChangeStream
  .filter(rmDirPredicate)
  .map(last)
  .map(pathToPathList)
  .map(interleaveChildren);

//  :: EventStream [String] -- A stream of new file paths
let rmFileSegmentStream = fsChangeStream
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

//  :: Object, [[String], {stat}] -> Object
let addFile = (lib, [xs, stat]) => {

  if (!mori.getIn(lib, xs)) {
    return mori.assocIn(lib, xs, statToFile(stat));
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

export default libStream.map(x => mori.toJs(x));

///////////////////////////////////////////////////////////////////////////////
