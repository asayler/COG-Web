var ladda_login = null;

function login_onload() {
    ladda_login = Ladda.create(document.querySelector("button#login"));
}

function try_login(username, password) {

    console.log("Attempting Login: " + username);

    $.ajax({
        type: "GET",
        url: "https://api-cog.cs.colorado.edu/tokens/",
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        },
        success: function(data, status) {
            login(data, status, username)
        },
        error: login_failure
    });

}

function login_failure(xhr, status, error) {

    // Stop Login Button Animation
    ladda_login.stop();
    $("button#login").children("span.ladda-label").html("Login");

    // Log Error
    console.log("Status: " + status, ", Error: " + error);
    $("#username").val("");
    $("#password").val("");
    $("#loginerror").text("Login Failed: " + error);

}

$("form#loginform").submit(function() {

    // Start Login Button Animation
    ladda_login.start();
    $("button#login").children("span.ladda-label").html("Logging In...");

    // Get Input
    var username = $("input#username").val();
    var password = $("input#password").val();

    // Validate Data
    if(username.length == 0) {
	    $("#loginerror").text("Username Required");
	    return false;
    }
    if(password.length == 0) {
	    $("#loginerror").text("Password Required");
	    return false;
    }

    // Attempt Login
    try_login(username, password);
    return false
    
});
