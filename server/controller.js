///////////////////////////////////////////////////////////////////////////////
//
// Controller
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let bacon                    = require('baconjs');
let toHTML                   = require('vdom-to-html');
let { compose, curry, last } = require('ramda');
let { toPair }               = require('./lib/helpers');
let server                   = require('./server');

let page                     = require('../src/js/views/page');
let buildTree                = require('../src/js/views/tree');

let model                    = require('./model');

//// CONTROLLER ///////////////////////////////////////////////////////////////

//  :: String path -> Function sink -> Function binder
let pathBinder = curry((path, sink) => server.get(path, compose(sink, toPair)));

//  :: Stream([req, res])
let indexRequestStream = new bacon.fromBinder(pathBinder('/'));

//  :: String
let renderPage = () => {
  return `<!doctype html>${toHTML(page)}`;
};

//  :: [req, res] -> Effect
let indexResponse = compose(res => {
  res.send(renderPage());
}, last);

indexRequestStream.onValue(indexResponse);
model.onValue(lib => {

  console.log(lib);
  let treeView = buildTree(lib);
  //console.log(toHTML(treeView));

}); // A stream of library models.

// TODO
// - represent the model using vdom
// - wow...

///////////////////////////////////////////////////////////////////////////////
