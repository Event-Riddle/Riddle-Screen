var filter = function() {

  var filter = this;


  var filterConf = [];

  var incoming = [];
  var outgoing = [];
  var mySetUp= 13;
  var mySetDown = 4;
  var myName = null;

   filter.connection = function(){
     var amqp = require('amqplib/callback_api');

     // if the connection is closed or fails to be established at all, we will reconnect
  var amqpConn = null;
  function start() {
    amqp.connect("amqp://vvesrlkq:7cTOIc7-W2awpfANfNqHsFx7tMfocTds@white-swan.rmq.cloudamqp.com/vvesrlkq?heartbeat=60", function(err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(start, 1000);
      }
      conn.on("error", function(err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function() {
        console.error("[AMQP] reconnecting");
        return setTimeout(start, 1000);
      });
      console.log("[AMQP] connected");
      amqpConn = conn;
      whenConnected();
    });

  }


  function whenConnected() {
    startPublisher();
    startWorker();
  }

  var pubChannel = null;
  var offlinePubQueue = [];
  function startPublisher() {
    amqpConn.createConfirmChannel(function(err, ch) {
      if (closeOnErr(err)) return;
        ch.on("error", function(err) {
        console.error("[AMQP] channel error", err.message);
      });
      ch.on("close", function() {
        console.log("[AMQP] channel closed");
      });

      pubChannel = ch;
      while (true) {
        var m = offlinePubQueue.shift();
        if (!m) break;
        publish(m[0], m[1], m[2]);
      }
    });
  }

  function publish(exchange, routingKey, content) {
    try {
      pubChannel.publish(exchange, routingKey, content, { persistent: true },
                        function(err, ok) {
                          if (err) {
                            console.error("[AMQP] publish", err);
                            offlinePubQueue.push([exchange, routingKey, content]);
                            pubChannel.connection.close();
                          }
                        });
    } catch (e) {
      console.error("[AMQP] publish", e.message);
      offlinePubQueue.push([exchange, routingKey, content]);
    }
  }
// A worker that acks messages only if processed succesfully
  function startWorker() {
    amqpConn.createChannel(function(err, ch) {
      if (closeOnErr(err)) return;
      ch.on("error", function(err) {
        console.error("[AMQP] channel error", err.message);
      });

      ch.on("close", function() {
        console.log("[AMQP] channel closed");
      });

      ch.prefetch(10);
      ch.assertQueue("filter", { durable: false }, function(err, _ok) {
        if (closeOnErr(err)) return;
        ch.consume("filter", processMsg, { noAck: false });
        console.log("Worker is started");
      });

      function processMsg(msg) {
        work(msg, function(ok) {
          try {
            if (ok)
              ch.ack(msg);
            else
              ch.reject(msg, true);
          } catch (e) {
            closeOnErr(e);
          }
        });
      }
    });
  }

  function work(msg, cb) {
    console.log("Got msg ", msg.content.toString());

    var incomingEvents = filterMe(msg.content.toString(), publish, cb);

    // if (incomingEvents != "undefined" && incomingEvents) {
    //
    //       publish("", "lucullus", new Buffer(incomingEvents));
    // }
    //
    // cb(true);
  }

  function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
  }

 //  setInterval(function() {
 //    publish("", "lucullus", new Buffer('[{"TEST":"TEST","name" :"brate","trehshold" : 100,"trehshold-top" : 120,"active" : true}]'));
 // }, 1000);

start();

  }

  var filterMe = function(incomingEv, callback1, callback2) {
    var http = require('http');

    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    var options = {
      host: 'riddle-api.mybluemix.net',
      path: 'api/v1/config/filter'
    };

    callback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {

        filterConf = JSON.parse(str);
        outgoing = [];
        var incoming = JSON.parse(incomingEv);
        var up = incoming[0]['trehshold-top'];
        var down = incoming[0]['trehshold'];
        myName = incoming[0]['name'];

        filterConf.forEach(function functionName(t) {

          if(typeof t['name']  !== 'undefined' && t['name']) {
            if (t['inlineChecked']==true) {


              if(up <= t['treshold-top'] && down >= t['threshold'] ){
                 if(up >= down){


                        outgoing.push(incoming);
                  }
              }
            }
          }
        }
      );

        if(outgoing.length > 0 ){
          for (var i = 0, len = outgoing[0].length; i < len; i++) {

            callback1("", "lucullus", new Buffer(JSON.stringify(outgoing[i]) ));
            callback2(true);
          }
        //  callback1("", "lucullus", new Buffer('[{"TEST":"TEST","name" :"brate","trehshold" : 100,"trehshold-top" : 120,"active" : true}]'));
        //  callback1(("", "lucullus", new Buffer(JSON.stringify(outgoing[0]))));

        //  callback2(true);
        //  return outgoing;
        }
      });
    }

    http.request(options, callback).end();

  }

}

module.exports = new filter;
