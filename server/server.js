///////////////////////////////////////////////////////////////////////////////
//
// Server
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let express      = require('express');
let morgan       = require('morgan');
let errorHandler = require('errorhandler');
let http         = require('http');
let httpProxy    = require('http-proxy');

//// CONFIGURATION ////////////////////////////////////////////////////////////

let app     = express();
let server  = http.Server(app);
let env     = process.env.NODE_ENV || 'development';
let port    = process.env.PORT || 3000;
let oneYear = 31557600000;
let proxy   = httpProxy.createProxyServer({ changeOrigin : true });

// Serve static files from dist folder
app.use(express.static('dist', { maxAge: oneYear }));

console.log('________________________________________');

if (env === 'development') {

  console.log('Server is in development mode');

  let bundle = require('./bundle');
  bundle();

  app.use(morgan('dev'));
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));

  // Any requests to /build is proxied to webpack-dev-server
  app.all('/build/*', (req, res) => {
    proxy.web(req, res, { target : 'http://localhost:8080' });
  });

} else {

  app.use(morgan());
  app.use(errorHandler());

}

//// PROXY ////////////////////////////////////////////////////////////////////

proxy.on('error', () => {
  console.log('Could not connect to proxy ... ');
});

//// LAUNCH ///////////////////////////////////////////////////////////////////

server.listen(port);
console.log('Server listening on port ' + port);

///////////////////////////////////////////////////////////////////////////////

module.exports = app;

///////////////////////////////////////////////////////////////////////////////
