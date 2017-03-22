
var filter = function() {

var  common_options = null;

  function _init(opt){
    common_options = opt;
  }

  function _filterEvent(incomingEv) {

          var incoming = incomingEv;

           if(typeof common_options['name'] !== 'undefined' && common_options['name']) {
             if (common_options['active'] == true) {
               if (incoming[common_options['filter-top-id']] == common_options['threshold-value-top']) {

                      console.log('drin2');
                      return false;

                }
               }
             }
            return incoming;
  }



  return {
           filterEvent: _filterEvent,
           init: _init
         };

}

module.exports = new filter;
