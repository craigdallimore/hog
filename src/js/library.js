///////////////////////////////////////////////////////////////////////////////
//
// Library
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import { fromBinder } from 'baconjs';

import { TO_CLIENT, FROM_CLIENT } from '../../constants.js';

import socket from './socket';
import buildTree from './views/tree';

///////////////////////////////////////////////////////////////////////////////

let rootNode = document.querySelector('.library');

// :: Object socket -> EventStream of messages from the server
let bindFromServerStream = socket => fromBinder(sink => socket.on(TO_CLIENT, sink));

// :: String -> Object
let parseJSON = x => JSON.parse(x);

// :: Node, Patches -> Node
let patchNode = (node, patches) => patch(node, patches);

// :: EventStream
let libStream = bindFromServerStream(socket).map(parseJSON);

libStream
  .map('.library')            // When the library changes
  .map(buildTree)             // build a virtual dom tree
  .scan(rootNode, diff)       // and comparing it with an existing tree
  .skip(1)                    // (but not the first)
  .scan(rootNode, patchNode)  // start applying patches.
  .onValue();

///////////////////////////////////////////////////////////////////////////////
