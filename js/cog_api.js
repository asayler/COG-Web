---
---

function get_auth(url, callback, callback_error) {
    var token = $.cookie(COOKIE_TOKEN_NAME);
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        success: callback,
        error: callback_error
    });
}

function post_auth(url, callback, callback_error, data) {
    var token = $.cookie(COOKIE_TOKEN_NAME);
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        data: data,
        success: callback,
        error: callback_error
    });
}

function put_auth(url, callback, callback_error, data) {
    var token = $.cookie(COOKIE_TOKEN_NAME);
    $.ajax({
        type: "PUT",
        url: url,
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        data: data,
        success: callback,
        error: callback_error
    });
}

function file_post(callback, callback_error, form_data) {
    var url = "{{ site.cog_api_url }}/files/";
    var token = $.cookie(COOKIE_TOKEN_NAME);
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
        success: callback,
        error: callback_error
    });
}

function assignments_get(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/assignments/";
    get_auth(url, callback, callback_error);
}

function assignments_get_submitable(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/assignments/submitable/";
    get_auth(url, callback, callback_error);
}

function assignment_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function assignment_tests_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/tests/";
    get_auth(url, callback, callback_error);
}

function assignment_submission_create(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/submissions/";
    var data = {};
    post_auth(url, callback, callback_error, JSON.stringify(data));
}

function submission_add_files(callback, callback_error, uuid, file_lst) {
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/files/";
    var data = {'files': file_lst};
    put_auth(url, callback, callback_error, JSON.stringify(data));
}

function submission_run_test(callback, callback_error, uuid_sub, uuid_tst) {
    var url = "{{ site.cog_api_url }}/submissions/" + uuid_sub + "/runs/";
    var data = {'test': uuid_tst};
    post_auth(url, callback, callback_error, JSON.stringify(data));
}

function test_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/tests/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function run_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/runs/" + uuid + "/";
    get_auth(url, callback, callback_error);
}
