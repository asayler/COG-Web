/*global
  $, debug, util, session
*/

(function(window, document) {

  var log = debug('cog-web:common');

  $(document).ready(function() {
    log('document fully loaded, now applying authenticate state markers');

    if (session.isActive()) {
      log('user is authenticated, populating header with user information');

      $('span#auth-state').text('Logged in as ' + $.cookie('cog_user'));
      $('button#auth-button').text('Logout');
    } else {
      log('user not authenticated, leaving navigation bar untouched');
    }

    $('button#auth-button').click(function() {
      log('click event fired for authentication toggle button');
      // destroy the current active user session
      if (session.isActive()) session.destroy();

      // redirect regardless of authentication state
      util.redirect('/login/');
    });

  });

})(window, document);
