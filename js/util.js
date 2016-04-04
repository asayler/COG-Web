(function(window, document) {

  var log = debug('cog-web:util');

  function redirect(dest) {
    window.stop();
    log('redirecting to new destination: `%s`', dest);
    window.location = dest;
  }

  function generateBasicAuth(username, password) {
    password = password || '';
    var hash = btoa(username + ':' + password);
    return 'Basic ' + hash;
  }

  window.util = {
    redirect: redirect,
    generateBasicAuth: generateBasicAuth
  };

})(window, document);
