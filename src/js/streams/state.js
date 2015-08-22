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
let mouseOverStream = domEventBus.filter(e => e.type === 'mouseover').map(() => true);

// :: EventStream
let mouseOutStream  = domEventBus.filter(e => e.type === 'mouseout').map(() => false);

// :: EventStream
let isOverStream = mouseOverStream
  .merge(mouseOutStream)
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
