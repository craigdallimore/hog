///////////////////////////////////////////////////////////////////////////////
//
// Hog server
//
///////////////////////////////////////////////////////////////////////////////

let bacon                    = require('baconjs');
let toHTML                   = require('vdom-to-html');
let { compose, curry, last } = require('ramda');
let { toPair }               = require('./lib/helpers');

let page  = require('../src/js/views/page');
let model = require('./model');

// Set up
// ----------------------------------------------------------------------------
let express      = require('express');
let app          = express();
let morgan       = require('morgan');
let errorHandler = require('errorhandler');
let server       = require('http').Server(app);
let env          = process.env.NODE_ENV || 'development';
let port         = process.env.PORT || 3000;

// Configuration
// ----------------------------------------------------------------------------
app.set('views', __dirname + '/views/');

let oneYear = 31557600000;

app.use(express.static(__dirname + '/../',       { maxAge: oneYear }));
app.use(express.static(__dirname + '/../static', { maxAge: oneYear }));

if (env === 'development') {

  app.use(morgan('dev'));
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));

} else {

  app.use(morgan());
  app.use(errorHandler());

}

// ----------------------------------------------------------------------------

//  :: String path -> Function sink -> Function binder
let pathBinder = curry((path, sink) => app.get(path, compose(sink, toPair)));

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
model.onValue(console.log.bind(console)); // A stream of library models.

// TODO
// - represent the model using vdom
// - wow...

// Launch
// ----------------------------------------------------------------------------
server.listen(port);
console.log('Node server listening on port ' + port);
