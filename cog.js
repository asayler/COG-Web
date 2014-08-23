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

function login_success(data, status) {
    console.log("Status: " + status, ", Token: " + data.token);
    $("output#error").text("Login Successfull")
}

function login_failure(xhr, status, error) {
    console.log("Status: " + status, ", Error: " + error);
    $("output#error").text("Login Failed")
}

$("form#login").submit(function() {
    var username = $("input#username").val()
    var password = $("input#password").val()
    login(username, password)
});

function log_res(data, status) {
    console.log("Data: " + data + ", Status: " + status);
}
