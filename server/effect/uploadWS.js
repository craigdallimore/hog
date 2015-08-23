///////////////////////////////////////////////////////////////////////////////
//
// Upload via websocket
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { basename } from 'path';
import { head, split } from 'ramda';
import { mkdir, createWriteStream } from 'fs';
import ss from 'socket.io-stream';
import { fromBinder } from 'baconjs';

import { FILE_UPLOAD } from '../../constants.js';
import socketStream from '../streams/socket';

// :: Stream stream, File file -> ?
let onUpload = (stream, file) => {

  console.log('RECEIVING', file);

  let name = basename(file.name);
  let type = head(split('/', file.type));

  let uploadDir  = `../library/${type}/`;
  let uploadPath = `${uploadDir}/${name}`;

  console.log(uploadPath);

  stream.pipe(createWriteStream(uploadPath));

  stream.on('end', () => {
    console.log('SAVED', name);
  });

};

let uploadStreams = socketStream.onValue(socket => {
  return fromBinder(sink => ss(socket).on(FILE_UPLOAD, sink));
});
///////////////////////////////////////////////////////////////////////////////

