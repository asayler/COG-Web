function login_failure(xhr, status, error) {
    console.log("Status: " + status, ", Error: " + error);
    $("#username").val("");
    $("#password").val("");
    $("#loginerror").text("Login Failed: " + error);
}

$("form#login").submit(function() {

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

    // Login
    try_login(username, password, login_failure);
    return false
    
});
