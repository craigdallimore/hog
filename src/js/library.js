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

let treeStream = libStream
  .map('.library')
  .map(buildTree)
  .scan(rootNode, diff)
  .skip(1)
  .scan(rootNode, patchNode)
  .onValue();

///////////////////////////////////////////////////////////////////////////////
