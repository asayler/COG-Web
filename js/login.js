---
---

(function() {

  var log = debug('cog-web:page:login');
  var button = $('#login-button').ladda();

  log('initialization of page complete');

  $('#login-form').submit(function(event) {
    event.preventDefault();

    // collect field data from the form
    var username = $('#username').val();
    var password = $('#password').val();

    log('attempting to authenticate user `%s`', username);

    // start the loading ticker and indicate that the form is busy
    button.ladda('start');
    $('#login-button').children('span.ladda-label').html('Logging In...');

    var req = authenticate(username, password);

    // run on successful sign-on
    req.done(function(data, status, xhr) {
      var token = data.token;
      log('authenticated success, received token `%s`', token);

      session.authUser(username, token);
      util.redirect('/submit/');
    });

    // run in the rest of cases
    req.error(function(xhr, status, err) {
      log('user failed to authenticate, error: `%s`', error);

      // stop the loading ticker
      button.ladda('stop');
      $('#login-button').children('span.ladda-label').html('Login');

      // display the error to the user
      $('#login-error').text('Login Failed: ' + err);

      // clear the password field and set focus to it
      $('#password').val('').focus();
    });
  });

  function authenticate(username, password) {
    // use the basic authentication header
    var basicAuth = function(xhr) {
      var val = util.generateBasicAuth(username, password);
      xhr.setRequestHeader('Authorization', val);
    };

    return $.ajax({
      type: 'GET',
      url: '{{ site.cog_api_url }}/my/token/',
      beforeSend: basicAuth
    });
  }

})();
