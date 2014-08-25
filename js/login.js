function login_success(data, status) {
    $.cookie("cog_token", data.token, { path: '/' });
    window.location.replace(SUBMIT_URL);
}

function login_failure(xhr, status, error) {
    console.log("Status: " + status, ", Error: " + error);
    $("input#username").val("");
    $("input#password").val("");
    $("output#error").text("Login Failed");
}

$("form#login").submit(function() {

    // Get Input
    var username = $("input#username").val();
    var password = $("input#password").val();

    // Validate Data
    if(username.length == 0) {
	$("output#username_error").text("Username Required");
	return false;
    }
    if(password.length == 0) {
	$("output#password_error").text("Password Required");
	return false;
    }

    // Login
    login(username, password, login_success, login_failure);

});
