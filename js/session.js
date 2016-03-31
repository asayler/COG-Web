(function(window, document) {

  var log = debug('cog-web:session');
  var token = $.cookie('cog_token');

  var path = window.location.pathname;
  var authRequired = {
    '/': true,
    '/submit/': true,
    '/history/': true
  };

  log('requested access to `%s` with token: %s', path, token);

  // if no token and not at login, redirect
  if (!token && authRequired[path]) {
    log('unauthenticated user, redirecting to `/login/`');

    log('terminating load of page `%s`', path);
    redirect('/login/');

  // pages that do not require a session can be directly loaded
  } else {
    log('access permitted to unrestricted page `%s`', path);
  }

  // authenticated users can be directed to the submission page
  if (token && path === '/') {
    log('active session with token %s, redirecting to `/submit/`', token);

    log('terminating load of page `%s`', path);
    redirect('/submit/');
  }

  function redirect(dest) {
    window.stop();
    log('redirecting to new destination: `%s`', dest);
    window.location = dest;
  }

  window.session = {
    authUser: function(user, token) {
      var opts = { expires: 1, path: '/', secure: false };
      $.cookie('cog_user', user, opts);
      $.cookie('cog_token', token, opts);
    }
  };

})(window, document);
