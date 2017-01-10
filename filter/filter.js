var filter = function() {
  var common_options = {name: 'test',
                        threshold: 30,
                        ['threshold-top']:120,
                        inlineChecked: true,
                        unit :'cm'};

  function _init(opt){
      common_options = {name: '',
                        threshold: null,
                        ['threshold-top']:null,
                        inlineChecked: false,
                        unit :''};
  }

  function _filterEvent(incomingEv) {
          console.log('drin '+JSON.parse(incomingEv));
          console.log(incomingEv);
          var incoming = JSON.parse(incomingEv);
          var unit = incoming['unit'];
          var value = incoming['value'];
          var name = incoming['name'];

          if(typeof common_options['name'] !== 'undefined' && common_options['name']) {
            if (common_options['inlineChecked'] == true) {
              if (name == common_options[name]) {
                if(value <= common_options['threshold-top'] && value >= common_options['threshold'] ){

                     console.log('drin2');
                     return incoming;

                  }
                }
              }
            }
            return false;
      }



  return {
           filterEvent: _filterEvent,
           init: _init
         };

}

module.exports = new filter;
