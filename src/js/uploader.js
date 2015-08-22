///////////////////////////////////////////////////////////////////////////////
//
// Uploader
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

import dragTarget from './views/dragTarget';

import { domEventBus } from './domEvent';
import { fromArray } from 'baconjs';
import { apply } from 'ramda';

///////////////////////////////////////////////////////////////////////////////

let mouseOverStream = domEventBus.filter(e => e.type === 'mouseover').map(() => true);
let mouseOutStream  = domEventBus.filter(e => e.type === 'mouseout').map(() => false);
let overStream      = mouseOverStream.merge(mouseOutStream);

let rootNode = document.querySelector('.uploader');
let tree = dragTarget({ isOver: false });

// Boolean -> Object model
let boolToModel = bool => ({ isOver: bool });

// Node node, Object patches -> Node
let patchNode = (node, patches) => patch(node, patches);

let treeStream = fromArray([rootNode, tree])
  .concat(overStream
    .map(boolToModel)
    .map(dragTarget));

treeStream
  .slidingWindow(2)
  .skip(2)
  .map(apply(diff))
  .scan(rootNode, patchNode)
  .onValue();

///////////////////////////////////////////////////////////////////////////////
