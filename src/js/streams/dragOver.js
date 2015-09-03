///////////////////////////////////////////////////////////////////////////////
//
// Drag Over Stream
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { DRAG_OVER, DRAG_ENTER, DRAG_LEAVE } from '../../../constants';
import { domEventBus } from './domEvent';
import { T, F } from 'ramda';
import dropStream from './drop';

//// HELPERS //////////////////////////////////////////////////////////////////

// :: Event -> Boolean
let dragOverPredicate  = e => e.event === DRAG_OVER;
let dragEnterPredicate = e => e.event === DRAG_ENTER;
let dragLeavePredicate = e => e.event === DRAG_LEAVE;

///////////////////////////////////////////////////////////////////////////////

// :: EventStream
// It is necessary to prevent default here to make a valid dropzone.
let dragOverStream = domEventBus
  .filter(dragOverPredicate);

dragOverStream.onValue();

// :: EventStream(true)
// It is necessary to prevent default here to make a valid dropzone.
let dragEnterStream = domEventBus
  .filter(dragEnterPredicate)
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
