///////////////////////////////////////////////////////////////////////////////
//
// Delete Effect
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { domEventBus } from '../streams/domEvent';
import { REMOVE_FILE } from '../../../constants';
import socket from '../streams/socket';

//// HELPERS //////////////////////////////////////////////////////////////////

const removePredicate = e => e.event === REMOVE_FILE;

const emitDeleteEvent = filePath => socket.emit(REMOVE_FILE, filePath);

///////////////////////////////////////////////////////////////////////////////

domEventBus
  .filter(removePredicate)
  .map('.file')
  .map('.filePath')
  .onValue(emitDeleteEvent);

///////////////////////////////////////////////////////////////////////////////
