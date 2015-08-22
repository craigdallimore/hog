///////////////////////////////////////////////////////////////////////////////
//
// Effect
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import stateStream from '../streams/state';

///////////////////////////////////////////////////////////////////////////////

// :: DOMNode node, Function stateToModel, Function modelToVDOM
// -> Effectful Eventstream that will mutate the node as state changes,
// mapping the state to a model that is rendered to a virtual DOM, and
// patched to the DOM.
// Note - the Effectful EventStream will need a subscriber to start.
export default (node, stateToModel, modelToVDOM) => {

  return stateStream
    .map(stateToModel)
    .map(modelToVDOM)
    .diff(node, diff)
    .scan(node, patch);

};

///////////////////////////////////////////////////////////////////////////////
