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
const dragOverPredicate  = e => e.event === DRAG_OVER;
const dragEnterPredicate = e => e.event === DRAG_ENTER;
const dragLeavePredicate = e => e.event === DRAG_LEAVE;

///////////////////////////////////////////////////////////////////////////////

// :: EventStream
// It is necessary to prevent default here to make a valid dropzone.
const dragOverStream = domEventBus
  .filter(dragOverPredicate);

dragOverStream.onValue();

// :: EventStream(true)
// It is necessary to prevent default here to make a valid dropzone.
const dragEnterStream = domEventBus
  .filter(dragEnterPredicate)
  .map(T);

// :: EventStream(false)
const dragLeaveStream = domEventBus
  .filter(dragLeavePredicate)
  .map(F);

const dragDoneStream = dropStream.map(F);

// :: EventStream(Bool)
const isOverStream = dragEnterStream
  .merge(dragLeaveStream)
  .merge(dragDoneStream)
  .startWith(false);

//// EXPORTS //////////////////////////////////////////////////////////////////

export default isOverStream;

///////////////////////////////////////////////////////////////////////////////
