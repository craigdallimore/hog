///////////////////////////////////////////////////////////////////////////////
//
// Library
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import stateToModel from '../mappings/library';
import modelToVDOM from '../views/tree';
import effect from '../lib/effect';

///////////////////////////////////////////////////////////////////////////////

let rootNode = document.querySelector('.library');

effect(rootNode, stateToModel, modelToVDOM).onValue();

///////////////////////////////////////////////////////////////////////////////
