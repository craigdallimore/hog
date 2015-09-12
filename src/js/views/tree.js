///////////////////////////////////////////////////////////////////////////////
//
// Tree
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import { REMOVE_FILE } from '../../../constants';
import h from 'virtual-dom/h';
import { compose, toPairs }  from 'ramda';
import { domEventBus } from '../streams/domEvent';

//// HELPERS //////////////////////////////////////////////////////////////////

// :: Model -> Event
const handleRemoveFileClick = file => ({ event : REMOVE_FILE, file });

// :: Event -> undefined
const pushToStream = e => domEventBus.push(e);

//// COMPONENT ////////////////////////////////////////////////////////////////

// :: [String name, Object model] -> Virtual DOM
const buildNode = ([name, model]) => {

  if (model.children) {
    return h('li', { className : 'library__branch' }, [
      h('span', name),
      h('ul', toPairs(model.children).map(buildNode))
    ]);
  }

  if (model.percentage) {

    let textContent = `${name} - ${model.percentage}`;

    return h('li', { className : 'library__leaf library__leaf--upload' },
    [
      h('span', {
        className : 'library__leaf__percentage'
      }, textContent)
    ]);
  }

  return h('li', { className : 'library__leaf' },
  [
    h('a', {
      'className' : 'link',
      'href' : '/' + model.filePath
    }, name),
    h('button', {
      'className' : 'btn btn-remove',
      'ev-click'  : compose(pushToStream, handleRemoveFileClick).bind(null, model)
    },
    'remove')
  ]);

};

const modelToVDOM = model => {

  return h(
    'ul',
    {
      className : 'library'
    },
    toPairs(model.children).map(buildNode)
  );

};

//// EXPORTS //////////////////////////////////////////////////////////////////

export default modelToVDOM;

///////////////////////////////////////////////////////////////////////////////
