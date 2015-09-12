///////////////////////////////////////////////////////////////////////////////
//
// Page layout
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

import h from 'virtual-dom/h';
import buildTree from './tree';
import upload from './upload';
import filterControl from './filterControl';

const { NODE_ENV } = process.env;
const jsPath  = NODE_ENV === 'development' ? 'build/bundle.js' : 'bundle.js';
const cssPath = 'bundle.css';

//// PAGE  ////////////////////////////////////////////////////////////////////

const page = model => {

  console.log(model);

  const cssLink = NODE_ENV === 'development' ? null : h('link', {
    'rel': 'stylesheet',
    'href': cssPath
  });

  return h('html', [

    h('head', [
      h('meta', {
        'charset': 'utf-8'
      }),
      h('meta', {
        'httpEquiv': 'x-ua-compatible',
        'content': 'ie=edge'
      }),
      h('title', 'HOG'),
      h('meta', {
        'name': 'description',
        'content': ''
      }),
      h('meta', {
        'name': 'viewport',
        'content': 'width=device-width, initial-scale=1'
      }),
      cssLink
    ]),

    h('body', [

      upload,
      filterControl(model.filterText),
      buildTree(model.library),

      h('script', {
        'src': jsPath
      })

    ])

  ]);

};

//// EXPORTS //////////////////////////////////////////////////////////////////

module.exports = page;

///////////////////////////////////////////////////////////////////////////////
