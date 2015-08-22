///////////////////////////////////////////////////////////////////////////////
//
// Library
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import { fromBinder } from 'baconjs';

import { TO_CLIENT } from '../../constants.js';

import socket from './socket';
import modelToVDOM from './views/tree';

//// HELPERS //////////////////////////////////////////////////////////////////

// :: String -> Object
let parseJSON = x => JSON.parse(x);

// :: Socket s -> EventStream of messages from the server
let bindFromServerStream = s => fromBinder(sink => s.on(TO_CLIENT, sink));

///////////////////////////////////////////////////////////////////////////////

// :: EventStream
let modelStream = bindFromServerStream(socket)
  .map(parseJSON)
  .map('.library');

let rootNode = document.querySelector('.library');

modelStream
  .map(modelToVDOM)
  .diff(rootNode, diff)
  .scan(rootNode, patch)
  .onValue();

///////////////////////////////////////////////////////////////////////////////
