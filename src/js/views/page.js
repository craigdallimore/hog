///////////////////////////////////////////////////////////////////////////////
//
// Page layout
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let h            = require('virtual-dom/h');
let buildTree    = require('./tree');
let upload       = require('./upload');
let { NODE_ENV } = process.env;
let jsPath       = NODE_ENV === 'development' ? 'build/bundle.js' : 'bundle.js';
let cssPath      = NODE_ENV === 'development' ? 'build/bundle.css' : 'bundle.css';

//// PAGE  ////////////////////////////////////////////////////////////////////

let page = model => {

  return h('html', [

    h('head', [
      h('meta', {
        'charset': 'utf-8'
      }),
      h('meta', {
        'httpEquiv': 'x-ua-compatible',
        'content': 'ie=edge'
      }),
      h('title', 'Page title'),
      h('meta', {
        'name': 'description',
        'content': ''
      }),
      h('meta', {
        'name': 'viewport',
        'content': 'width=device-width, initial-scale=1'
      }),
      h('link', {
        'rel': 'stylesheet',
        'href': cssPath
      })
    ]),

    h('body', [

      h('h1', 'Virtual'),

      upload,

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
