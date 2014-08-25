function get_auth(url, callback) {
    var token = $.cookie("cog_token");
    $.ajax({
        type: "GET",
        url: url,
        async: false,
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
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        data: data,
        success: callback
    });
}

function put_auth(url, callback, data) {
    var token = $.cookie("cog_token");
    $.ajax({
        type: "PUT",
        url: url,
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        data: data,
        success: callback
    });
}

function file_post(callback, form_data) {
    var url = "https://api-cog.cs.colorado.edu/files/";
    var token = $.cookie("cog_token");
    $.ajax({
        type: 'POST',
        url: url,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
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

function assignment_tests_get(callback, uuid) {
    var url = "https://api-cog.cs.colorado.edu/assignments/" + uuid + "/tests/";
    get_auth(url, callback);
}

function assignment_submission_create(callback, uuid) {
    var url = "https://api-cog.cs.colorado.edu/assignments/" + uuid + "/submissions/";
    var data = {}
    post_auth(url, callback, JSON.stringify(data));
}

function submission_add_files(callback, uuid, file_lst) {
    var url = "https://api-cog.cs.colorado.edu/submissions/" + uuid + "/files/";
    var data = {'files': file_lst}
    put_auth(url, callback, JSON.stringify(data));
}

function submission_run_test(callback, uuid_sub, uuid_tst) {
    var url = "https://api-cog.cs.colorado.edu/submissions/" + uuid_sub + "/runs/";
    var data = {'test': uuid_tst}
    post_auth(url, callback, JSON.stringify(data));
}

function test_get(callback, uuid) {
    var url = "https://api-cog.cs.colorado.edu/tests/" + uuid + "/";
    get_auth(url, callback);
}
