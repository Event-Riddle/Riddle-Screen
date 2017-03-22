/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

// // get the app environment from Cloud Foundry
// var appEnv = cfenv.getAppEnv();
//
// // start server on the specified port and binding host
// app.listen(appEnv.port, '0.0.0.0', function() {
//   // print a message when the server starts listening
//   console.log("server starting on " + appEnv.url);
// });

var bodyParser = require('body-parser');
var http = require('http');
// var filter = require('filter');
var honeypot = require(__dirname + '/honeypot/honeypot');

var app = express();

app.use(bodyParser.json());

app.post('/activate', function(req, res) {
  console.log("i was activated");
  //console.log(req.body);
  startFilter();
  res.end('filter was activated - response 200 OK ');
});

app.post('/deactivate', function(req, res) {
  console.log("i was deactivated");
  console.log(req.body);
  var response = stopFilter();
  console.log(response);
  if(response == false) res.end('filter is not activate - response 400 ');
  res.end('filter was deactivated - response 200 OK ');
  //TODO: disconnect honeypot
});

httpserv = http.createServer(app).listen(8888, function() {
    console.log('http on port 8888');
});

function startFilter(){
  console.log("filter started")
  honeypot.init("filter", "lucullus");
  honeypot.connect('amqp://vvesrlkq:7cTOIc7-W2awpfANfNqHsFx7tMfocTds@white-swan.rmq.cloudamqp.com/vvesrlkq', filter);
}

function stopFilter(){
  return honeypot.disconnect();
}

function filter(){
  return "filtered message";
}
