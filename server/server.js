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

//// CONFIGURATION ////////////////////////////////////////////////////////////

let app     = express();
let server  = http.Server(app);
let env     = process.env.NODE_ENV || 'development';
let port    = process.env.PORT || 3000;
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

//// LAUNCH ///////////////////////////////////////////////////////////////////

server.listen(port);
console.log('________________________________________');
console.log('Server listening on port ' + port);

///////////////////////////////////////////////////////////////////////////////

module.exports = app;

///////////////////////////////////////////////////////////////////////////////
