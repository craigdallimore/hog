///////////////////////////////////////////////////////////////////////////////
//
// Page layout
//
///////////////////////////////////////////////////////////////////////////////

/* jshint quotmark:false */
'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let h = require('virtual-dom/h');

//// PAGE  ////////////////////////////////////////////////////////////////////

let page = h('html', [

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
      'href': 'bundle.css'
    })
  ]),

  h('body', [
    h('h1', 'Virtual'),
    h('script', {
      'src': 'bundle.js'
    })
  ])

]);

//// EXPORTS //////////////////////////////////////////////////////////////////

module.exports = page;

///////////////////////////////////////////////////////////////////////////////
