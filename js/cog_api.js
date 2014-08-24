function get_auth(url, callback) {
    var token = $.cookie("cog_token");
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        success: callback
    });
}

function post_auth(url, callback, data) {
    var token = $.cookie("cog_token");
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        data: data,
        success: callback
    });
}

function assignments_get(callback) {
    var url = "https://api-cog.cs.colorado.edu/assignments/";
    get_auth(url, callback);
}

function assignment_get(callback, uuid) {
    var url = "https://api-cog.cs.colorado.edu/assignments/" + uuid + "/";
    get_auth(url, callback);
}

function file_post(callback, data) {
    var url = "https://api-cog.cs.colorado.edu/files/";
    
}
