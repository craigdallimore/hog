///////////////////////////////////////////////////////////////////////////////
//
// Upload HTTP
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { identity, split, head, last, compose, curry, invoker } from 'ramda';
import { fromNodeCallback, fromBinder, when } from 'baconjs';
import { mkdir, writeFile } from 'fs';
import path from 'path';
import multer from 'multer';

import { app } from '../server';
import { toPair } from '../lib/helpers';

const upload = multer();

//// CONTROLLER ///////////////////////////////////////////////////////////////

let libraryPath = path.join(__dirname, '/../../library/');

//  :: String uploadPath -> Function sink -> Function binder
let uploadReqResBinder  = curry((uploadPath, sink) => app.post(uploadPath, upload.single('basicUpload'), compose(sink, toPair)));

//  :: EventStream([req, res])
let fileReqResStream = fromBinder(uploadReqResBinder('/upload'));

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

  return fromNodeCallback(mkdir, fullPath)
    .mapError()
    .map(() => fullPath);

});

// :: EventStream(String filePaths)
let filePathStream = when(
  [targetDirStream, fileNameStream],
  (targetPath, name) => path.join(targetPath, '/', name)
);

// :: EventStream(String writtenFilePaths)
let writeStream = fileBufferStream
  .sampledBy(filePathStream, toPair)
  .flatMap(([buffer, filePath]) => {

    return fromNodeCallback(writeFile, filePath, buffer)
      .map(() => filePath);

  });

//  :: String -> Effect
let uploadRedirect = invoker(1, 'redirect');

//// SIDE EFFECTS /////////////////////////////////////////////////////////////

when([uploadResponseStream, writeStream], identity)
  .delay(100)
  .onValue(uploadRedirect('/'));

///////////////////////////////////////////////////////////////////////////////
