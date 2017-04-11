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

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// // start server on the specified port and binding host
// app.listen(appEnv.port, '0.0.0.0', function() {
//   // print a message when the server starts listening
//   console.log("server starting on " + appEnv.url);
// });

// parse incoming request bodies in a middleware before your handlers, available under the req.body property.
var bodyParser = require('body-parser');

var http = require('http');

// connect honeypot
var honeypot = require(__dirname + '/honeypot/honeypot');

// use bodyParser
app.use(bodyParser.json());

// start filter
app.post('/activate', function(req, res) {
  console.log("i was activated");
  // req.body = [
  //                 {
  //                   'name': 'TestFilter',
  //                   'threshold-value-bottom': '25',
  //                   'threshold-value-top': '29',
  //                   'filter-bottom-id': '2pac',
  //                   'filter-top-id': 'Degree',
  //                   'unit': 'cm',
  //                   'active': true
  //                 },
  //                 {
  //                   'name': 'TestFilter2',
  //                   'threshold-value-bottom': '40',
  //                   'threshold-value-top': '30',
  //                   'filter-bottom-id': '2pac',
  //                   'filter-top-id': 'Name',
  //                   'unit': 'cm',
  //                   'active': true
  //                 }
  //               ];
  if(req.body !== 'undefined' && Object.keys(req.body).length !=0){
    console.log("request body: ");
    console.log(req.body);

    var common_options = req.body;

    startFilter(common_options);
  }else {
    console.log("request body is empty");
    console.log(req.body);
    res.end('filter was stoped - response 409 empty request body!');
    return false;
  }

  res.end('filter was activated - response 200 OK ');
});

// deactivate filter
app.post('/deactivate', function(req, res) {
  console.log("i was deactivated");
  console.log(req.body);
  var response = stopFilter();
  console.log(response);
  if(response == false) res.end('filter is not activate - response 400 ');
  res.end('filter was deactivated - response 200 OK ');
  //TODO: disconnect honeypot
});

// start server on the specified port and binding host
httpserv = http.createServer(app).listen(appEnv.port, function() {
    console.log("server starting on " + appEnv.url);
});

// init filter and honeypot
function startFilter(options){
  console.log("filter started");
  // create a new event filter
  var filter = require(__dirname + '/filter/filter');
  //stop anny active filters
  stopFilter();
  filter.init(options);
  honeypot.init("filter", "lucullus");
  honeypot.connect('amqp://vvesrlkq:7cTOIc7-W2awpfANfNqHsFx7tMfocTds@white-swan.rmq.cloudamqp.com/vvesrlkq', filter);
}

//stopFilter
function stopFilter(){
  return honeypot.disconnect();
}

function filter(){
  return "filtered message";
}
