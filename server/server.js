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

const PROXY_PORT = 8080;
const PORT       = process.env.PORT || 3000;

let app     = express();
let server  = http.Server(app);
let env     = process.env.NODE_ENV || 'development';
let oneYear = 31557600000;

// Serve static files from dist folder
app.use(express.static('dist', { maxAge: oneYear }));

console.log('________________________________________');

if (env === 'development') {

  console.log('Server is in development mode');

  let proxy  = httpProxy.createProxyServer({ changeOrigin : true });
  let bundle = require('../build/dev');

  bundle(PROXY_PORT);

  app.use(morgan('dev'));
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));

  // Any requests to /build is proxied to webpack-dev-server
  app.all('/build/*', (req, res) => {
    proxy.web(req, res, { target : `http://localhost:${PROXY_PORT}` });
  });

  proxy.on('error', () => {
    console.log('Could not connect to proxy ... ');
  });

} else {

  console.log('Server is in production mode');

  app.use(morgan('combined'));
  app.use(errorHandler());

}

//// LAUNCH ///////////////////////////////////////////////////////////////////

server.listen(PORT);
console.log('Server listening on port ' + PORT);

///////////////////////////////////////////////////////////////////////////////

export { app, server };

///////////////////////////////////////////////////////////////////////////////
