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
import buildTree from './views/tree';

///////////////////////////////////////////////////////////////////////////////

let rootNode = document.querySelector('.library');

// :: Socket s -> EventStream of messages from the server
let bindFromServerStream = s => fromBinder(sink => s.on(TO_CLIENT, sink));

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
