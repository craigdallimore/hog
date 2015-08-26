///////////////////////////////////////////////////////////////////////////////
//
// Socket
//
///////////////////////////////////////////////////////////////////////////////

//// LIBS /////////////////////////////////////////////////////////////////////

import { connect } from 'socket.io-client';
import ss from 'socket.io-stream';
import { combineAsArray, fromBinder } from 'baconjs';
import { compose, curry, add, map } from 'ramda';
import { LIBRARY_CHANGED, FILE_UPLOAD } from '../../../constants';

//// HELPERS //////////////////////////////////////////////////////////////////

// :: String -> Object
let parseJSON = x => JSON.parse(x);

// :: Socket s -> EventStream of messages from the server
let bindFromServerStream = s => fromBinder(sink => s.on(LIBRARY_CHANGED, sink));

// :: BlobReadstream s -> EventStream
let bindBlobReadStream = s => fromBinder(sink => s.on('data', sink));

// :: Number total -> Number current -> Number percentage
let toPercentage = curry((total, current) => Math.floor(current / total * 100));

// :: Object file, Number percentage -> Object file
const updatePercentage = (acc, percentage) => {
  acc.percentage = percentage;
  return acc;
};

///////////////////////////////////////////////////////////////////////////////

const socket = connect(location.href);

// :: File -> EventStream
const fileToFileProgressStream = file => {

  let stream = ss.createStream();

  let item = {
    name : file.name,
    type : file.type,
    size : file.size
  };

  // Inform the server that a stream is coming.
  ss(socket).emit(FILE_UPLOAD, stream, item);

  let blobReadStream = ss.createBlobReadStream(file);
  blobReadStream.pipe(stream);

  // Get the size of each chunk, and add them up.
  // Compare it to the size of the file to get the percentage
  // and provide a stream of the state of the file as it is uploaded.
  let progressStream = bindBlobReadStream(blobReadStream)
    .map('.length')
    .scan(0, add)
    .map(toPercentage(file.size))
    .scan(item, updatePercentage);

  return progressStream;

};

//// EXPORTS //////////////////////////////////////////////////////////////////

// :: FileList fileList -> EventStream
export const uploadStream = compose(
  combineAsArray,
  map(fileToFileProgressStream)
);

export const libraryStream = bindFromServerStream(socket)
  .map(parseJSON)
  .map('.library');

///////////////////////////////////////////////////////////////////////////////
