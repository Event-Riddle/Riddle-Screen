
var filter = function() {

var  common_options_init = null;

  function _init(opt){
    common_options_init = opt;
  }

  function _filterEvent(incomingEv) {

          var incoming = incomingEv;
          var filtered = false;

    common_options_init.forEach(function myFunction(common_options, index) {
      if(typeof common_options['name'] !== 'undefined' && common_options['name']) {
        if (common_options['active'] == true) {
          if (incoming[common_options['filter-top-id']] == common_options['threshold-value-top']) {

                 console.log('drin2');
                 filtered = true;
                 //return false;

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



  return {
           filterEvent: _filterEvent,
           init: _init
         };

}

module.exports = new filter;
