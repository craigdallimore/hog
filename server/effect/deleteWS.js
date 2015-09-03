///////////////////////////////////////////////////////////////////////////////
//
// Delete WS
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { REMOVE_FILE } from '../../constants';
import socketStream from '../streams/socket';
import { fromNodeCallback, fromBinder } from 'baconjs';
import { unlink } from 'fs';

///////////////////////////////////////////////////////////////////////////////

// :: Object socket -> EventStream(String filePath)
const socketToDeletePathStream = socket => fromBinder(sink => socket.on(REMOVE_FILE, sink));

// :: EventStream(String filePath)
const deletePathStream = socketStream.flatMap(socketToDeletePathStream);

// :: String -> EventStream
const unlinkedStream = filePath => fromNodeCallback(unlink, filePath);

deletePathStream.flatMap(unlinkedStream).onValue();

///////////////////////////////////////////////////////////////////////////////
