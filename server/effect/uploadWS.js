///////////////////////////////////////////////////////////////////////////////
//
// Upload via websocket
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

const { libraryPath } = require('../../config.json');

import guid from 'guid';
import { join, basename } from 'path';
import { compose, head, last, split } from 'ramda';
import { rename, mkdir, createWriteStream } from 'fs';
import ss from 'socket.io-stream';
import { when, fromNodeCallback, fromBinder } from 'baconjs';

import { toPair } from '../lib/helpers';
import { FILE_UPLOAD } from '../../constants.js';
import socketStream from '../streams/socket';

// :: File -> EventStream(String path)
const fileToPath = file => {

  const name = basename(file.name);
  const type = head(split('/', file.type));

  const uploadDir  = join(__dirname, '..', '..', libraryPath, type);
  const uploadPath = join(uploadDir, name);

  // Attempt to create the directory and return the final
  // file path
  return fromNodeCallback(mkdir, uploadDir)
    .mapError()
    .map(() => uploadPath);

};

// :: Object socket -> EventStream([stream, file])
const socketToUploadStream = socket => fromBinder(sink => ss(socket).on(FILE_UPLOAD, compose(sink, toPair)));

// :: EventStream([stream, file])
const uploadStream = socketStream.flatMap(socketToUploadStream);

// :: EventStream(stream)
const receiveStreamStream = uploadStream.map(head);

// :: EventStream(file)
const receiveFileStream = uploadStream.map(last);

// :: EventStream(String filePath)
const  pathStream = receiveFileStream.flatMap(fileToPath);

// :: Stream -> EventStream
const bindStreamEnd = stream => fromBinder(sink => stream.on('end', sink));

// :: Stream stream, String finalPath -> EventStream(String savedPath)
const saveFile = (stream, finalPath) => {

  const tempPath = guid.create().value;

  // Stream the file to a temp directory
  stream.pipe(createWriteStream(tempPath));

  // When the stream ends, move the file to the final spot
  return bindStreamEnd(stream)
    .flatMap(() => fromNodeCallback(rename, tempPath, finalPath))
    .map(() => finalPath);

};

// When a new socket stream is created for a file upload, save the file and
// subscribe to the stream of the file save event.
when([receiveStreamStream, pathStream], saveFile)
  .onValue(stream => stream.onValue());

///////////////////////////////////////////////////////////////////////////////
