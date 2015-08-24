///////////////////////////////////////////////////////////////////////////////
//
// State
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

//import mori from 'mori';
import { libraryStream } from './socket';
import { update } from 'baconjs';
import isOverStream from './dragOver';

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
