///////////////////////////////////////////////////////////////////////////////
//
// Client entry
//
///////////////////////////////////////////////////////////////////////////////

'use strict';
require('../scss/main.scss');

//// IMPORTS //////////////////////////////////////////////////////////////////

import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import { fromBinder } from 'baconjs';

import { TO_CLIENT, FROM_CLIENT } from '../../constants.js';

import socket from './socket';
import buildTree from './views/tree';

///////////////////////////////////////////////////////////////////////////////

// :: Object socket -> EventStream of messages from the server
let bindFromServerStream = socket => fromBinder(sink => socket.on(TO_CLIENT, sink));

let serverStream = bindFromServerStream(socket);

let rootNode = document.querySelector('.library');
let tree = null;
let libStream = serverStream.map(x => JSON.parse(x));

libStream.onValue(model => {

  if (!tree) {
    tree = buildTree(model.library);
    return;
  }

  let newTree = buildTree(model.library);
  let dom     = createElement(newTree);
  let patches = diff(tree, newTree);
  rootNode    = patch(rootNode, patches);
  tree        = newTree;

});

///////////////////////////////////////////////////////////////////////////////
