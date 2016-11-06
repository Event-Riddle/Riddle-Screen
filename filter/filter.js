var filter = function() {

  var filter = this;

 var test = [{
                      "name" :"brate",
                      "trehshold" : 12,
                      "trehshold-top" : 30,
                      "active" : true
                    },
                    {
                      "name" : "rate",
                      "trehshold" : 5,
                      "trehshold-top" : 4,
                      "active" : true
                    }
                  ];

  var incoming = [{
                       "name" :"brate",
                       "trehshold" : 12,
                       "trehshold-top" : 30,
                       "active" : true
                     }
                   ];

  var outgoing = [];
  var mySetUp= 13;
  var mySetDown = 4;
  var myName = null;

   filter.connection = function(){

     var mqtt = require('mqtt')
     var client  = mqtt.connect('mqtt://test.mosquitto.org')

     client.on('connect', function () {
       client.subscribe('presence')
       client.publish('presence', 'Hello mqtt')

     })

     client.on('message', function (topic, message) {
       // message is Buffer
    //   console.log(message.toString())
        filterMe(incoming);
      // filterMe(message);
        client.end()

     })
  }

  var filterMe = function(incoming) {
outgoing = [];
    var up = incoming[0]['trehshold-top'];//u
    var down = incoming[0]['trehshold'];//d
    myName = incoming[0]['name'];//n

  test.forEach(function functionName(t) {

    if(typeof t['name']  !== "undefined" && t['name']) {
      if (t['active']==true) {

        if(up <= t['trehshold-top'] && down >= t['trehshold'] ){
           if(up >= down){
                  outgoing.push(incoming);

            }
        }
      }
    }
  });
  console.log(1);
  console.log(outgoing);
  return outgoing;

  }

}

module.exports = new filter;
