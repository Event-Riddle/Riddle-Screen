
var filter = function() {

      var common_options = {
                          'name': 'Adolf',
                          'threshold-value-bottom': 'Hitler',
                          'threshold-value-top': '30',
                          'filter-bottom-id': '2pac',
                          'filter-top-id': 'Degree',
                          'unit': 'cm',
                          'active': true
                          };

  function _init(opt){
      common_options = {
                        'name': '',
                        'threshold-value-bottom': '',
                        'threshold-value-top': '',
                        'filter-bottom-id': '',
                        'filter-top-id': '',
                        'unit': '',
                        'active': false
                      };
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
