///////////////////////////////////////////////////////////////////////////////
//
// State
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { toClj, getIn, assocIn, assoc, hashMap } from 'mori';
import { update } from 'baconjs';
import { reduce, compose, head, split } from 'ramda';
import { libraryStream } from './socket';
import isOverStream from './dragOver';
import uploadsStream from '../streams/upload';

//// HELPERS //////////////////////////////////////////////////////////////////

// :: Object state, Object library -> Object state
const updateLibrary = (state, library) => assoc(state, 'library', toClj(library));

// :: Object state, Boolean isOver -> Object state
const updateIsOver = (state, isOver) => assoc(state, 'isOver', isOver);

// :: String -> String
const mimeTypeToType = compose(head, split('/'));

// :: Object state, File file -> Object state
const updateUploadingFile = (state, file) => {

  let type = mimeTypeToType(file.type);
  let name = file.name;

  let level1 = ['library', 'children', type];
  let level2 = level1.concat(['children']);
  let level3 = level2.concat([name]);

  // If a directory for this type is not available, present one.
  if (!getIn(state, level1)) {
    state = assocIn(state, level1, hashMap({ children: hashMap() }));
  }

  // Add / update the file in the directory.
  if (getIn(state, level2)) {
    return assocIn(state, level3, toClj(file));
  }

  return state;

};

///////////////////////////////////////////////////////////////////////////////

// :: hashMap
const initialState = hashMap(
  'library', hashMap(),
  'isOver', false
);

// :: EventStream
const stateStream = update(initialState,
  [libraryStream], updateLibrary,
  [isOverStream], updateIsOver,
  [uploadsStream], reduce(updateUploadingFile)
);

export default stateStream;

///////////////////////////////////////////////////////////////////////////////
