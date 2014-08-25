var SUBMIT_URL = "submit.html";
var LOGIN_URL = "login.html";

function token_redirect() {
    var token = $.cookie('cog_token');
    if(token) {
        if(document.URL.indexOf(SUBMIT_URL) == -1) {
            console.log("Redirecting to " + SUBMIT_URL + " from " + document.URL);
            window.location.replace(SUBMIT_URL); 
        }
    }
    else {
        if(document.URL.indexOf(LOGIN_URL) == -1) {
            console.log("Redirecting to " + LOGIN_URL + " from " + document.URL);
            window.location.replace(LOGIN_URL); 
        }
    }
}

function make_base_auth(username, password) {
    var token = username + ':' + password;
    var hash = btoa(token);
    return 'Basic ' + hash;
}

function login(username, password, success, failure) {
    $.ajax({
        type: "GET",
        url: "https://api-cog.cs.colorado.edu/tokens/",
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        },
        success: success,
        error: failure
    });
}

function logout() {
    $.removeCookie("cog_token", { path: '/' });
    window.location.replace(LOGIN_URL);
}
