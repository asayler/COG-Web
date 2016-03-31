(function(window, document) {
  
  var util = {
    genBasicAuth: function(username, password) {
      var hash = btoa(username + ':' + password);
      return 'Basic ' + hash;
    }
  };

  window.util = util;
  
})(window, document);
