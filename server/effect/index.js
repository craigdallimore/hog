///////////////////////////////////////////////////////////////////////////////
//
// Index Response
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORT ///////////////////////////////////////////////////////////////////

import { onValues } from 'baconjs';
import { invoker } from 'ramda';
import indexResponseStream from '../streams/indexResponse';
import htmlStream from '../streams/html';

///////////////////////////////////////////////////////////////////////////////

//  :: String -> Effect
let indexResponse = invoker(1, 'send');

//// SIDE EFFECTS /////////////////////////////////////////////////////////////

// A little subtlety here: we don't want the htmlStream to update without the
// index response stream - otherwise we'll be attempting to send a response
// that hasn't been requested (and thus using the previous response, which is an
// error).

onValues(htmlStream.sampledBy(indexResponseStream), indexResponseStream, indexResponse);

///////////////////////////////////////////////////////////////////////////////
