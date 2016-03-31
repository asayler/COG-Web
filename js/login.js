---
---

(function() {

  var log = debug('cog-web:page:login');
  var loginButton = $('#login-button').ladda();

  log('initialization of page complete');

  $('#login-form').submit(function(event) {
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();

    log('attempting to authenticate user `%s`', username);

    // start the loading ticker
    loginButton.ladda('start');
    $('#login-button').children('span.ladda-label').html('Logging In...');

    var req = authenticate(username, password);

    // callback to run on successful sign-on
    req.done(function(data, status, xhr) {
      var token = data.token;
      log('authenticated success, received token `%s`', token);

      session.authUser(username, token);
      log('redirecting user to authenticated user page default: `/submit/`');
      window.location = '/submit/';
    });

    // callback to run for the rest of cases
    req.error(function(xhr, status, error) {
      log('user failed to authenticate, error: `%s`', error);

      // stop the loading ticker
      loginButton.ladda('stop');
      $('#login-button').children('span.ladda-label').html('Login');

      // show the user the error
      $('#login-error').text('Login Failed: ' + error);

      // clear the password field and focus it
      $('#password').val('').focus();
    });
  });

  function authenticate(username, password) {
    // use the HTTP basic authentication header
    var basicAuth = function(xhr) {
      var val = make_base_auth(username, password);
      xhr.setRequestHeader('Authorization', val);
    };

    return $.ajax({
      type: 'GET',
      url: '{{ site.cog_api_url }}/my/token/',
      beforeSend: basicAuth
    });
  }

})();
