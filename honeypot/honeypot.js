var amqp = require('amqplib/callback_api');

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

          //  console.log(JSON.parse(msg.content.toString()));
            ch.ack(msg);
            console.log('in consumer');
            filtered = filter.filterEvent(JSON.parse(msg.content.toString()));

            if(filtered != 'undefined' && filtered){
              console.log('publish succeeded');
              console.log("publish event: " + JSON.stringify(filtered));
              puber.sendToQueue(targetQ, new Buffer(JSON.stringify(filtered)));
            }else {
              console.log("event was excluded");
            }
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
      if(connect == ""){
        return false;
      };
      console.log('disconnect');
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
