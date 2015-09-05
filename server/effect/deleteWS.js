///////////////////////////////////////////////////////////////////////////////
//
// Delete WS
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { REMOVE_FILE, LIBRARY_NAME } from '../../constants';
import { libraryPath } from '../../config.json';
import socketStream from '../streams/socket';
import { fromNodeCallback, fromBinder } from 'baconjs';
import { unlink } from 'fs';

///////////////////////////////////////////////////////////////////////////////

// :: Object socket -> EventStream(String filePath)
const socketToDeletePathStream = socket => fromBinder(sink => socket.on(REMOVE_FILE, sink));

// :: EventStream(String filePath)
const deletePathStream = socketStream
  .flatMap(socketToDeletePathStream)
  .map(path => path.replace(LIBRARY_NAME, libraryPath));

// :: String -> EventStream
const unlinkedStream = filePath => fromNodeCallback(unlink, filePath);

deletePathStream.flatMap(unlinkedStream).onValue();

///////////////////////////////////////////////////////////////////////////////
