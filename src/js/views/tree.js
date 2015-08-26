///////////////////////////////////////////////////////////////////////////////
//
// Tree
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

let h = require('virtual-dom/h');
let { toPairs } = require('ramda');

//// COMPONENT ////////////////////////////////////////////////////////////////

let buildNode = ([name, model]) => {

  if (model.children) {
    return h('li', [
      h('span', name),
      h('ul', toPairs(model.children).map(buildNode))
    ]);
  }

  if (model.percentage) {

    let textContent = `${name} - ${model.percentage}`;

    return h('li', [
      h('span', textContent)
    ]);
  }

  return h('li', [
    h('a', {
      'href' : '/' + model.filePath
    }, name)
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
