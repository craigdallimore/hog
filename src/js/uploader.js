///////////////////////////////////////////////////////////////////////////////
//
// Uploader
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

import modelToVDOM from './views/dragTarget';

import { domEventBus } from './domEvent';

///////////////////////////////////////////////////////////////////////////////

// :: EventStream
let mouseOverStream = domEventBus.filter(e => e.type === 'mouseover').map(() => true);

// :: EventStream
let mouseOutStream  = domEventBus.filter(e => e.type === 'mouseout').map(() => false);

// :: EventStream
let modelStream = mouseOverStream
  .merge(mouseOutStream)
  .startWith(false)
  .map(bool => ({ isOver : bool }));

// :: DOMNode
let rootNode = document.querySelector('.uploader');

modelStream
  .map(modelToVDOM)
  .diff(rootNode, diff)
  .scan(rootNode, patch)
  .onValue();

///////////////////////////////////////////////////////////////////////////////
