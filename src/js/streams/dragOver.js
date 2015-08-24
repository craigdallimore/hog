///////////////////////////////////////////////////////////////////////////////
//
// Drag Over Stream
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { domEventBus } from './domEvent';
import { T, F } from 'ramda';
import dropStream from './drop';

//// HELPERS //////////////////////////////////////////////////////////////////

let dragOverPredicate  = e => e.type === 'dragover';
let dragEnterPredicate = e => e.type === 'dragenter';
let dragLeavePredicate = e => e.type === 'dragleave';

///////////////////////////////////////////////////////////////////////////////

// :: EventStream
// It is necessary to prevent default here to make a valid dropzone.
let dragOverStream = domEventBus
  .filter(dragOverPredicate)
  .doAction('.preventDefault')

dragOverStream.onValue();

// :: EventStream(true)
// It is necessary to prevent default here to make a valid dropzone.
let dragEnterStream = domEventBus
  .filter(dragEnterPredicate)
  .doAction('.preventDefault')
  .map(T);

// :: EventStream(false)
let dragLeaveStream = domEventBus
  .filter(dragLeavePredicate)
  .map(F);

let dragDoneStream = dropStream.map(F);

// :: EventStream(Bool)
let isOverStream = dragEnterStream
  .merge(dragLeaveStream)
  .merge(dragDoneStream)
  .startWith(false);

//// EXPORTS //////////////////////////////////////////////////////////////////

export default isOverStream;

///////////////////////////////////////////////////////////////////////////////
