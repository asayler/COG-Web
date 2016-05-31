/*global
  debug, btoa
*/

(function(window, document) {

  var log = debug('cog-web:util');

  function redirect(dest) {
    window.stop();
    log('redirecting to new destination: `%s`', dest);
    window.location.assign(dest);
  }

  function generateBasicAuth(username, password) {
    // log('generating basic authorization header for user %s', username);
    password = password || '';
    var hash = btoa(username + ':' + password);
    return 'Basic ' + hash;
  }

  // adopted from http://stackoverflow.com/a/901144/1380918
  function getQueryParameter(key) {
    var url = window.location.href;
    key = key.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)', 'i');

    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    var val = decodeURIComponent(results[2].replace(/\+/g, ' '));
    log('parsing querystring parameter `%s`, found value %s', key, val);

    return val;
  }

  function getHashParameter(key) {
    var myHash = location.hash;
    key = key.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp('[#&]' + key + '(=([^&#]*)|&|#|$)', 'i');

    var results = regex.exec(myHash);
    if (!results) return null;
    if (!results[2]) return null;

    var val = decodeURIComponent(results[2].replace(/\+/g, ' '));
    log('parsing querystring parameter `%s`, found value %s', key, val);

    return val;
  }

  window.util = {
    redirect,
    generateBasicAuth,
    getQueryParameter,
    getHashParameter
  };

})(window, document);
