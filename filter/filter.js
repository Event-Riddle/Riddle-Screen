
var filter = function() {

var  common_options_init = null;

// init function to set the filter config
  function _init(opt){
    common_options_init = opt;
  }

// excluded event handling
  function _filterEvent(incomingEv) {

          var incoming = incomingEv;
          var filtered = false;

    common_options_init.forEach(function myFunction(common_options, index) {
      if( (common_options['name'] !== '' || common_options['name'] !== undefined) && common_options['name']) {
        console.log('name ok');
        if (common_options['active'] === true) {
          if((common_options['threshold-value-bottom'] === '' || common_options['threshold-value-bottom'] === undefined) && (common_options['threshold-value-top'] !== '' || common_options['threshold-value-top'] !== undefined)){
             if (incoming[common_options['filter-top-id']] == common_options['threshold-value-top']) {
                   filtered = true;
             }
           } else if((common_options['threshold-value-bottom'] !== '' || common_options['threshold-value-bottom'] !== undefined) && (common_options['threshold-value-top'] !== '' || common_options['threshold-value-top'] !== undefined)) {
              if (incoming[common_options['filter-top-id']] <= common_options['threshold-value-top'] && incoming[common_options['filter-top-id']] >= common_options['threshold-value-bottom']){
                filtered = true;
              }
           }
        }
      }
    })
    if(filtered){
      return false;
    }else{
      return incoming;
    }

  }


  // provide global functions
  return {
           filterEvent: _filterEvent,
           init: _init
         };

}

module.exports = new filter;
