/*global
  $, debug, util
*/

(function(window, document) {

  var log = debug('cog-web:session');
  var token = $.cookie('cog_token');
  var opts = { expires: 1, path: '/', secure: false };

  var path = window.location.pathname;
  var authRequired = {
    '/': true,
    '/submit/': true,
    '/history/': true,
    '/run/': true
  };

  var sub = token ? token.substring(0, 8) : undefined;
  log('requested access to `%s` with token: %s', path, sub);
  var restricted = authRequired[path];

  // if no token and not at login, redirect
  if (!token && restricted) {
    log('unauthenticated user, redirecting to `/login/`');

    log('terminating load of page `%s`', path);
    util.redirect('/login/');

  // pages that do not require a session can be directly loaded
  } else {
    var type = restricted ? 'restricted' : 'unrestricted';
    log('access permitted to %s page `%s`', type, path);
  }

  // authenticated users can be directed to the submission page
  if (token && path === '/') {
    log('active session with token %s, redirecting to `/submit/`', token);
    log('terminating load of page `%s` if active', path);
    util.redirect('/submit/');
  }

  function authUser(user, token) {
    log('creating new session for user `%s` with token `%s`', user, token);
    $.cookie('cog_user', user, opts);
    $.cookie('cog_token', token, opts);
  }

  function destroy() {
    log('destroying current active user session');
    $.removeCookie('cog_user', opts);
    $.removeCookie('cog_token', opts);
  }

  function isActive() {
    var token = $.cookie('cog_token');
    return !!token;
  }

  window.session = {
    authUser,
    destroy,
    isActive
  };

})(window, document);
