///////////////////////////////////////////////////////////////////////////////
//
// Server
//
///////////////////////////////////////////////////////////////////////////////

//// IMPORTS //////////////////////////////////////////////////////////////////

const express      = require('express');
const morgan       = require('morgan');
const errorHandler = require('errorhandler');
const http         = require('http');
const httpProxy    = require('http-proxy');
const config       = require('../config.json');
const { LIBRARY_NAME } = require('../constants');

//// CONFIGURATION ////////////////////////////////////////////////////////////

const { PROXY_PORT } = require('../constants');
const PORT       = process.env.PORT || 3000;
const app        = express();
const server     = http.Server(app);
const env        = process.env.NODE_ENV || 'development';
const oneYear    = 31557600000;
const libMount   = `/${LIBRARY_NAME}`; // Where the library is served / mounted

// Serve static files from dist folder
app.use(express.static('dist', { maxAge: oneYear }));
app.use(libMount, express.static(config.libraryPath, { maxAge: oneYear }));

console.log('________________________________________');

if (env === 'development') {

  console.log('Server is in development mode');
  console.log(`Starting proxy on ${PROXY_PORT}`);

  const proxy  = httpProxy.createProxyServer({ changeOrigin : true });
  const bundle = require('../build/dev');

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
