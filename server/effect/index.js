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

onValues(htmlStream, indexResponseStream, indexResponse);

///////////////////////////////////////////////////////////////////////////////