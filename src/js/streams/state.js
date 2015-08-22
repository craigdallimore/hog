///////////////////////////////////////////////////////////////////////////////
//
// State
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

//import mori from 'mori';
import { libraryStream } from './socket';
import { domEventBus } from './domEvent';
import { update } from 'baconjs';

// :: EventStream
// It is necessary to prevent default here to make a valid dropzone.
let dragOverStream = domEventBus
  .filter(e => e.type === 'dragover')
  .doAction('.preventDefault')

dragOverStream.onValue();

// :: EventStream
// It is necessary to prevent default here to make a valid dropzone.
let dragEnterStream = domEventBus
  .filter(e => e.type === 'dragenter')
  .doAction('.preventDefault')
  .map(() => true);

// :: EventStream
let dragLeaveStream = domEventBus
  .filter(e => e.type === 'dragleave')
  .map(() => false);

// :: EventStream
let dropStream = domEventBus.filter(e => e.type === 'drop')
  .doAction('.preventDefault');

dropStream.log();

// :: EventStream
let isOverStream = dragEnterStream
  .merge(dragLeaveStream)
  .startWith(false);

const initialState = {
  library : {},
  isOver : false
};

const stateStream = update(initialState,
  [libraryStream], (state, library) => {
    state.library = library; return state;
  },
  [isOverStream], (state, isOver) => {
    state.isOver = isOver; return state;
  }
);

export default stateStream;

///////////////////////////////////////////////////////////////////////////////
