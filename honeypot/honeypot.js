var amqp = require('amqplib/callback_api');
// create a new event filter
var filterInstance = require('../filter/filter');
var puber = null;
var connect = "";
var honeypot = function() {
    var sourceQ = "";
    var targetQ = "";
    var common_options = {durable: false, noAck: true};

    function bail(err) {
      console.error(err);
      process.exit(1);
    }

    function _init(source, target){
      sourceQ=source;
      targetQ=target;

    }

    // Publisher
    function publisher(conn) {
      console.log("publish to " + targetQ);
      conn.createChannel(on_open);
      function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(targetQ, common_options);
        //ch.sendToQueue(targetQ, new Buffer('something to do'));
        //console.log("HERE" + ch);
        puber = ch;
      }
    }

    // Consumer
    function consumer(conn, filter) {
      console.log("subscribe to " + sourceQ);
      var ok = conn.createChannel(on_open);
      function on_open(err, ch) {
        if (err != null) bail(err);
        ch.assertQueue(sourceQ, common_options);
        ch.consume(sourceQ, function(msg) {
          if (msg !== null) {

            console.log(JSON.parse(msg.content.toString()));
            ch.ack(msg);
            console.log('im Cunsumer');
            filtered = filterInstance.filterEvent(JSON.parse(msg.content.toString()));


            console.log("This is filtered " + JSON.stringify(filtered));
            if(filtered != 'undefined' && filtered){ console.log('publish erfolgt');
              puber.sendToQueue(targetQ, new Buffer(JSON.stringify(filtered)));
            }

        //    curl -H "Content-Type: application/json" -X POST -d '{"active":false,"filter-top-id":"value","filter-bottom-id":"value","threshold-value-top":value,"threshold-value-bottom":value,"unit":"cm"}' http://localhost:8888/activate


          }
        });
      }
    }

    function _connect(url, filter) {
      amqp.connect(url, function(err, conn) {
          if (err != null) bail(err);
          connect = conn;
          publisher(conn);
        //  console.log(puber);
          consumer(conn, filter, puber);

        });
    }

    function _disconnect() {
      if(connect == "") return false;
      connect.close();
      return true;

    }

    return {
      connect: _connect,
      disconnect: _disconnect,
      init: _init
    };
}

module.exports = new honeypot;
