///////////////////////////////////////////////////////////////////////////////
//
// Upload Controller
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let {
  identity,
  split,
  head,
  last,
  compose,
  curry,
  invoker
} = require('ramda');

let bacon      = require('baconjs');
let path       = require('path');
let multer     = require('multer');
let fs         = require('fs');
let { app }    = require('../server');
let { toPair } = require('../lib/helpers');
let upload     = multer();

//// CONTROLLER ///////////////////////////////////////////////////////////////

let libraryPath = path.join(__dirname, '/../../library/');

//  :: String uploadPath -> Function sink -> Function binder
let uploadReqResBinder  = curry((uploadPath, sink) => app.post(uploadPath, upload.single('basicUpload'), compose(sink, toPair)));

//  :: EventStream([req, res])
let fileReqResStream = bacon.fromBinder(uploadReqResBinder('/upload'));

//  :: EventStream(Object res);
let uploadResponseStream = fileReqResStream.map(last);

//  :: EventStream(Object file)
let fileStream = fileReqResStream
  .map(head)
  .map('.file');

//  :: EventStream(String targetPath)
let fileNameStream = fileStream
  .map('.originalname');

//  :: EventStream(Buffer)
let fileBufferStream = fileStream.map('.buffer');

//  :: EventStream(String mimeType)
let mimeTypeStream = fileStream
  .map('.mimetype')
  .map(split('/'))
  .map(head);

//  :: EventStream(String dirPaths)
//  This will create the directory if it doesn't exist.
let targetDirStream = mimeTypeStream.flatMap(type => {

  let fullPath = path.join(libraryPath + type);

  return bacon.fromNodeCallback(fs.mkdir, fullPath)
    .mapError()
    .map(() => fullPath)
    .skipErrors();

});

// :: EventStream(String filePaths)
let filePathStream = bacon.when(
  [targetDirStream, fileNameStream],
  (targetPath, name) => path.join(targetPath, '/', name)
);

// :: EventStream(String writtenFilePaths)
let writeStream = fileBufferStream
  .sampledBy(filePathStream, toPair)
  .flatMap(([buffer, filePath]) => {

    return bacon
      .fromNodeCallback(fs.writeFile, filePath, buffer)
      .map(() => filePath);

  });

//  :: String -> Effect
let uploadRedirect = invoker(1, 'redirect');

//// SIDE EFFECTS /////////////////////////////////////////////////////////////

bacon
  .when([uploadResponseStream, writeStream], identity)
  .delay(100)
  .onValue(uploadRedirect('/'));

///////////////////////////////////////////////////////////////////////////////
