///////////////////////////////////////////////////////////////////////////////
//
// Hog server
//
///////////////////////////////////////////////////////////////////////////////

let bacon                             = require('baconjs');
let h                                 = require('virtual-dom/h');
let toHTML                            = require('vdom-to-html');
let { invoker, compose, curry, last } = require('ramda');

let page = require('../src/js/views/page');

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

//  :: (a, b) => [a, b];
let toPair = (first, second) => [first, second];

//  :: String path -> Function sink -> Function binder
let pathBinder = curry((path, sink) => app.get(path, compose(sink, toPair)));

//  :: Stream([req, res])
let indexStream = new bacon.fromBinder(pathBinder('/'));

let renderPage = () => {
  return `<!doctype html>${toHTML(page)}`;
};

//  :: [req, res] -> Effect
let indexResponse = compose(res => {
  res.send(renderPage());
}, last);

indexStream.onValue(indexResponse);

// Launch
// ----------------------------------------------------------------------------
server.listen(port);
console.log('Node server listening on port ' + port);
