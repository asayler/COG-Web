---
---

function get_auth(url, callback, callback_error) {
    var token = $.cookie(COOKIE_TOKEN_NAME);
    $.ajax({
        type: "GET",
        url: url,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        success: callback,
        error: callback_error
    });
}

function get_auth_binary(url, callback, callback_error) {
    var token = $.cookie(COOKIE_TOKEN_NAME);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Authorization', make_base_auth(token, ''));

    xhr.onload = function() {
      if (this.status === 200) {
        var blob = this.response;
        return callback(blob);
      }

      callback_error();
    };

    xhr.send();
}

function post_auth(url, callback, callback_error, data) {
    var token = $.cookie(COOKIE_TOKEN_NAME);
    $.ajax({
        type: "POST",
        url: url,
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
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(token, ""));
        },
        data: data,
        success: callback,
        error: callback_error
    });
}

function file_post(callback, callback_error, progress, form_data) {
    var url = "{{ site.cog_api_url }}/files/";
    var token = $.cookie(COOKIE_TOKEN_NAME);

    // Reset upload progress bar
    $('span#upload-progress').text(0);

    $.ajax({
        xhr: function() {
            var xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", function(evt) {
                if (!evt.lengthComputable) return;

                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);

                progress(percentComplete);
            }, false);

            return xhr;
        },
        type: 'POST',
        url: url,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
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

function assignment_submission_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/submissions/";
    var data = {};
    get_auth(url, callback, callback_error);
}

function file_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/files/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function file_get_uri(uuid) {
    var uri = "{{ site.cog_api_url }}/files/" + uuid + "/contents/";
    return uri;
}

function file_get_contents(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/files/" + uuid + "/contents/";
    get_auth_binary(url, callback, callback_error);
}

function my_isadmin_get(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/my/isadmin/";
    get_auth(url, callback, callback_error);
}

function my_assignment_submission_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/my/assignments/" + uuid + "/submissions/";
    var data = {};
    get_auth(url, callback, callback_error);
}

function my_submission_run_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/my/submissions/" + uuid + "/runs/";
    var data = {};
    get_auth(url, callback, callback_error);
}

function my_uuid_get (callback, callback_error) {
    var url = "{{ site.cog_api_url }}/my/useruuid/";
    get_auth(url, callback, callback_error);
}

function submission_add_files(callback, callback_error, uuid, file_lst) {
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/files/";
    var data = {'files': file_lst};
    put_auth(url, callback, callback_error, JSON.stringify(data));
}

function submission_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function submission_get_files(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/files/";
    get_auth(url, callback, callback_error);
}

function submission_get_test(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/runs/";
    get_auth(url, callback, callback_error);
}

function submissions_get(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/submissions/";
    get_auth(url, callback, callback_error);
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

function users_get(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/users/";
    get_auth(url, callback, callback_error);
}

function user_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/users/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function users_and_usernames_get(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/users/usernames/";
    get_auth(url, callback, callback_error);
}

function user_assignment_submission_get(callback, callback_error, user_uuid, assignment_uuid) {
    var url = "{{ site.cog_api_url }}/users/" + user_uuid + "/assignments/" + assignment_uuid + "/submissions/";
    get_auth(url, callback, callback_error);
}

function user_submission_get_test(callback, callback_error, usr_uuid, sub_uuid) {
    var url = "{{ site.cog_api_url }}/users/" + usr_uuid + "/submissions/" + sub_uuid + "/runs/";
    get_auth(url, callback, callback_error);
}

function run_get(callback, callback_error, uuid) {
    var url = "{{ site.cog_api_url }}/runs/" + uuid + "/";
    get_auth(url, callback, callback_error);
}
