///////////////////////////////////////////////////////////////////////////////
//
// Controller
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let { compose, curry, invoker, nthArg } = require('ramda');

let bacon      = require('baconjs');
let toHTML     = require('vdom-to-html');
let server     = require('./server');

let page       = require('../src/js/views/page');
let modelProp  = require('./model');

//// CONTROLLER ///////////////////////////////////////////////////////////////

//  :: String path -> Function sink -> Function binder
let pathBinder = curry((path, sink) => server.get(path, compose(sink, nthArg(1))));

//  :: Stream([req, res])
let indexRequestStream = bacon.fromBinder(pathBinder('/'));

//  :: String -> Effect
let indexResponse = invoker(1, 'send');

//  :: Object model -> String HTML
let modelToHTML = model => `<!doctype html>${toHTML(page(model))}`;

//  :: EventStream string -- emit a new page on every index request
let htmlStream = modelProp.map(modelToHTML).sampledBy(indexRequestStream);

//// SIDE EFFECTS /////////////////////////////////////////////////////////////

bacon.onValues(htmlStream, indexRequestStream, indexResponse);

///////////////////////////////////////////////////////////////////////////////
