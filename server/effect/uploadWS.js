///////////////////////////////////////////////////////////////////////////////
//
// Upload via websocket
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { join, basename } from 'path';
import { compose, head, last, split } from 'ramda';
import { mkdir, createWriteStream } from 'fs';
import ss from 'socket.io-stream';
import { when, fromNodeCallback, fromBinder } from 'baconjs';

import { toPair } from '../lib/helpers';
import { FILE_UPLOAD } from '../../constants.js';
import socketStream from '../streams/socket';

// :: File -> EventStream(String path)
let fileToPath = file => {

  console.log('fileToPath', file);
  let name = basename(file.name);
  let type = head(split('/', file.type));

  let uploadDir  = join(__dirname, '..', '..', 'library', type);
  let uploadPath = join(uploadDir, name);

  // Attempt to create the directory and return the final
  // file path
  return fromNodeCallback(mkdir, uploadDir)
    .mapError()
    .map(() => uploadPath);

};

// :: Object socket -> EventStream
let socketToUploadStream = socket => fromBinder(sink => ss(socket).on(FILE_UPLOAD, compose(sink, toPair)));

let uploadStream        = socketStream.flatMap(socketToUploadStream);
let receiveStreamStream = uploadStream.map(head);
let receiveFileStream   = uploadStream.map(last);

let pathStream = receiveFileStream.flatMap(fileToPath);
receiveFileStream.log('file >');
pathStream.log('path >');

receiveStreamStream.combine(pathStream, (stream, path) => {

  console.log('start pipin');
  stream.pipe(createWriteStream(path));

  stream.on('end', () => {
    console.log('SAVED', path);
  });

}).onValue();

///////////////////////////////////////////////////////////////////////////////
