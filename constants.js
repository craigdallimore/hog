///////////////////////////////////////////////////////////////////////////////
//
// Constants
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

// Something is up with babel / webpack - using ES6 exports is not compiling, so
// I'm falling back to using CJS style module.exports

module.exports = {
  FROM_CLIENT : 'from_client',
  TO_CLIENT   : 'to_client'
};

///////////////////////////////////////////////////////////////////////////////