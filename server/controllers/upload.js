///////////////////////////////////////////////////////////////////////////////
//
// Upload Controller
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//// IMPORTS //////////////////////////////////////////////////////////////////

let { head, last, compose, curry, invoker } = require('ramda');

let bacon      = require('baconjs');
let multer     = require('multer');
let server     = require('../server');
let path       = require('path');
let fs         = require('fs');
let { toPair } = require('../lib/helpers');

let upload     = multer();

//// CONTROLLER ///////////////////////////////////////////////////////////////

//  :: String uploadPath -> Function sink -> Function binder
let uploadReqResBinder  = curry((uploadPath, sink) => server.post(uploadPath, upload.single('basicUpload'), compose(sink, toPair)));

//  :: String name -> Buffer -> Function sink -> Function binder
let fileWriteBinder = curry((name, buffer, sink) => fs.writeFile(name, buffer, sink));

//  :: EventStream([req, res])
let fileReqResStream = bacon.fromBinder(uploadReqResBinder('/upload'));

//  :: EventStream(Object res);
let uploadResponseStream = fileReqResStream.map(last);

//  :: EventStream(Object file)
let fileStream = fileReqResStream.map(head).map('.file');

//  :: EventStream(String targetPath)
let fileNameStream = fileStream
                        .map('.originalname')
                        .map(name => path.join(__dirname, '/../../library/', name));

//  :: EventStream(Buffer)
let fileBufferStream = fileStream.map('.buffer');

//  :: EventStream -- written file events
let writeStream = fileNameStream
                    .zip(fileBufferStream, fileWriteBinder)
                    .flatMap(bacon.fromBinder);

//  :: String -> Effect
let uploadRedirect = invoker(1, 'redirect');

//// SIDE EFFECTS /////////////////////////////////////////////////////////////

bacon.onValues(uploadResponseStream, writeStream, uploadRedirect('/'));

///////////////////////////////////////////////////////////////////////////////
