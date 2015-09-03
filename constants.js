///////////////////////////////////////////////////////////////////////////////
//
// Constants
//
///////////////////////////////////////////////////////////////////////////////

// Something is up with babel / webpack - using ES6 exports is not compiling, so
// I'm falling back to using CJS style module.exports

module.exports = {
  LIBRARY_CHANGED : 'ev-library-changed',
  FILE_UPLOAD     : 'ev-file-upload',
  REMOVE_FILE     : 'ev-file-remove',
  DRAG_ENTER      : 'ev-drag-enter',
  DRAG_LEAVE      : 'ev-drag-leave',
  DRAG_OVER       : 'ev-drag-over',
  DROP            : 'ev-drop'
};

///////////////////////////////////////////////////////////////////////////////
