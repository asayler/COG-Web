var COOKIE_USER_PARAMS = { expires: 1, path: '/', secure: false }
var COOKIE_USER_NAME = "cog_user"
var COOKIE_TOKEN_PARAMS = { expires: 1, path: '/', secure: false }
var COOKIE_TOKEN_NAME = "cog_token"

var dep = debug('cog-web:deprecation:common');

function make_base_auth(username, password) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var token = username + ':' + password;
    var hash = btoa(token);
    return 'Basic ' + hash;
}

function login(data, status, username) {
    $.cookie(COOKIE_USER_NAME, username, COOKIE_USER_PARAMS);
    $.cookie(COOKIE_TOKEN_NAME, data.token, COOKIE_TOKEN_PARAMS);
    window.location.replace('/submit/');
}

function logout() {
    $.removeCookie(COOKIE_TOKEN_NAME, COOKIE_TOKEN_PARAMS);
    $.removeCookie(COOKIE_USER_NAME, COOKIE_USER_PARAMS);
    window.location.replace('/login/');
}

function update_auth_state() {
    var token = $.cookie('cog_token');
    if (token) {
	    $("span#auth-state").text("Logged in as " + $.cookie(COOKIE_USER_NAME));
	    $("button#auth-button").text("Logout");
    }
    else {
	    $("span#auth-state").text("");
	    $("button#auth-button").text("Login");
    }
}

$("button#auth-button").click(function() {
    console.log("Clicked auth-button");
    var token = $.cookie('cog_token');

    if (token) {
        logout();
    }
    else {
        window.location.replace('/login');
    }
});
