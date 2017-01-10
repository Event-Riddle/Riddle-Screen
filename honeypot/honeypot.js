var amqp = require('amqplib/callback_api');
// create a new event filter
var filterInstance = require('../filter/filter');
var puber = null;

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
            console.log(msg.content.toString());
            ch.ack(msg);
            console.log('im Cunsumer');
            filtered = filterInstance.filterEvent(msg.content.toString());
            // puber.publish("", "lucullus", new Buffer(filtered), { persistent: false },
            //           function(err, ok) {
            //             if (err) {
            //               console.error("[AMQP] publish", err);
            //             }
            //           });
            console.log('wieder draußen');
            console.log(filtered);
            if(filtered != 'undefined' && filtered){
              puber.sendToQueue(targetQ, new Buffer(filtered));
            }
          }
        });
      }
    }

    function _connect(url, filter) {
      amqp.connect(url, function(err, conn) {
          if (err != null) bail(err);
          publisher(conn);
        //  console.log(puber);
          consumer(conn, filter, puber);

        });
    }

    return {
      connect: _connect,
      init: _init
    };
}

module.exports = new honeypot;
