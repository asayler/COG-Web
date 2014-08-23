// Get a handle on the first button element in the document.
// var button = document.querySelector( "button" );

// If a user clicks on it, say hello!
// button.addEventListener( "click", function( ev ) {
//     alert( "Hello" );
// }, false);

function make_base_auth(username, password) {
    var tok = username + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
}

function log_res(data, status) {
    console.log("Data: " + data + ", Status: " + status);
}

function login(username, password) {
    console.log("Username: " + username + ", Password: " + password)
    $.ajax({
        type: "GET",
        url: "https://api-cog.cs.colorado.edu/tokens/",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        },
        success: log_res
    });
}

$("#btn_login").click(function() {
    var username = $("#in_username").val()
    var password = $("#in_password").val()
    login(username, password)
});
