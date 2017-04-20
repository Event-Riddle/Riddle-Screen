
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

          if((common_options['threshold-value-bottom'] === '' || common_options['threshold-value-bottom'] === undefined) && (common_options['threshold-value-top'] !== '' || common_options['threshold-value-top'] !== undefined)){
            filtered = include(false, common_options['active'] ,common_options['name'], common_options['filter-top-id'], common_options['threshold-value-top'], common_options['threshold-value-bottom'], common_options['filtering'] ,incoming);

           } else if((common_options['threshold-value-bottom'] !== '' || common_options['threshold-value-bottom'] !== undefined) && (common_options['threshold-value-top'] !== '' || common_options['threshold-value-top'] !== undefined)) {
            filtered = include(true, common_options['active'] ,common_options['name'], common_options['filter-top-id'], common_options['threshold-value-top'], common_options['threshold-value-bottom'], common_options['filtering'] ,incoming);
          }

        })

    if(filtered){
      return false;
    }else{
      return incoming;
    }

  }

  function include(range, filteractive ,filtername, filtertopid, thresholdtop, thresholdbottom, coptfiltering, incoming){
    if (filteractive === true) {
      if( (filtername !== '' || filtername !== undefined) && filtername ) {
        switch (range) {
            case true:
                return _range(filtertopid, thresholdtop, thresholdbottom, coptfiltering, filtername, incoming);
                break;
            case false:
                return _match(filtertopid, thresholdtop, coptfiltering, filtername, incoming);
                break;
            default:
            break;
        }

      }else {
        return false;
      }
    }else{
      return false;
    }
  }

  function _match(filtertopid, thresholdtop, coptfiltering, filtername, incoming){

      switch (coptfiltering) {
        case 'exclude':
          return _matchExclude(filtertopid, thresholdtop, filtername, incoming);
          break;
        case 'include':
          return _matchInclude(filtertopid, thresholdtop, filtername, incoming);
          break;
        default:

      }

  }


  function _matchInclude(filtertopid, thresholdtop, filtername, incoming) {
    if (incoming[filtertopid] == thresholdtop && filtername == incoming['name']) {
      return false;
    }else {
      return true;
    }
  }

  function _matchExclude(filtertopid, thresholdtop, filtername, incoming) {
    if (incoming[filtertopid] == thresholdtop && filtername == incoming['name']) {
      return true;
    }else {
      return false;
    }
  }

  function _range(filtertopid, thresholdtop, thresholdbottom, coptfiltering, filtername, incoming){


      switch (coptfiltering) {
        case 'exclude':
          return _rangeExclude(filtertopid, thresholdtop, thresholdbottom, filtername, incoming);
          break;
        case 'include':
          return _rangeInclude(filtertopid, thresholdtop, thresholdbottom, filtername, incoming);
          break;
        default:

      }

  }

  function _rangeInclude(filtertopid, thresholdtop, thresholdbottom, filtername, incoming) {
    if (incoming[filtertopid] <= thresholdtop && incoming[filtertopid] >= thresholdbottom && filtername == incoming['name']) {
      console.log('range between: ' + thresholdtop + ' and ' + thresholdbottom);
      console.log('include event value: ' + incoming[filtertopid]);
      return false;
    }else {
      return true;
    }
  }

  function _rangeExclude(filtertopid, thresholdtop, thresholdbottom, filtername, incoming) {
    if (incoming[filtertopid] <= thresholdtop && incoming[filtertopid] >= thresholdbottom && filtername == incoming['name']) {
      console.log('range between: ' + thresholdtop + ' and ' + thresholdbottom);
      console.log('exclude event value: ' + incoming[filtertopid]);
      return true;
    }else {
      return false;
    }
  }


  // provide global functions
  return {
           filterEvent: _filterEvent,
           init: _init
         };

}

module.exports = new filter;
