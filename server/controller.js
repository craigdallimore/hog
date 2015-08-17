///////////////////////////////////////////////////////////////////////////////
//
// Controller
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

require('./controllers/index');
require('./controllers/upload');

import { TO_CLIENT, FROM_CLIENT } from '../constants.js';
import { onValues, fromArray, fromBinder } from 'baconjs';
import socketStream from './socket';
import libStream from './model';

// :: Object socket -> EventStream of messages from the client
let bindFromClientStream = socket => fromBinder(sink => socket.on(FROM_CLIENT, sink));

let fromClientStream = socketStream.flatMap(bindFromClientStream);

onValues(socketStream, libStream, (socket, message) => {
  socket.emit(TO_CLIENT, JSON.stringify(message));
});

fromClientStream.onValue(message => {
  console.log(`Server received: ${message}`);
});

///////////////////////////////////////////////////////////////////////////////
