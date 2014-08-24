var SUBMIT_URL = "submit.html"
var LOGIN_URL = "login.html"

function token_redirect() {
    token = $.cookie('cog_token');
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
    var tok = username + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
}

function login(username, password) {
    console.log("Username: " + username + ", Password: " + password)
    $.ajax({
        type: "GET",
        url: "https://api-cog.cs.colorado.edu/tokens/",
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        },
        success: login_success,
        error: login_failure
    });
}

function logout() {
    $.removeCookie("cog_token", { path: '/' })
    window.location.replace(LOGIN_URL);
}

function login_success(data, status) {
    console.log("Status: " + status, ", Token: " + data.token);
    $.cookie("cog_token", data.token, { path: '/' })
    window.location.replace(SUBMIT_URL);
}

function login_failure(xhr, status, error) {
    console.log("Status: " + status, ", Error: " + error);
    $("input#username").val("")
    $("input#password").val("")
    $("output#error").text("Login Failed")
}

function log_res(data, status) {
    console.log("Data: " + data + ", Status: " + status);
}
