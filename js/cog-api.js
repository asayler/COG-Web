---
---

var dep = debug('cog-web:deprecation:cog-api');

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
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/assignments/";
    get_auth(url, callback, callback_error);
}

function assignments_get_submitable(callback, callback_error) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/assignments/submitable/";
    get_auth(url, callback, callback_error);
}

function assignment_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function assignment_tests_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/tests/";
    get_auth(url, callback, callback_error);
}

function assignment_submission_create(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/submissions/";
    var data = {};
    post_auth(url, callback, callback_error, JSON.stringify(data));
}

function assignment_submission_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/assignments/" + uuid + "/submissions/";
    var data = {};
    get_auth(url, callback, callback_error);
}

function file_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/files/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function file_get_uri(uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var uri = "{{ site.cog_api_url }}/files/" + uuid + "/contents/";
    return uri;
}

function file_get_contents(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/files/" + uuid + "/contents/";
    get_auth_binary(url, callback, callback_error);
}

function my_isadmin_get(callback, callback_error) {
    var url = "{{ site.cog_api_url }}/my/isadmin/";
    get_auth(url, callback, callback_error);
}

function my_assignment_submission_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/my/assignments/" + uuid + "/submissions/";
    var data = {};
    get_auth(url, callback, callback_error);
}

function my_submission_run_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/my/submissions/" + uuid + "/runs/";
    var data = {};
    get_auth(url, callback, callback_error);
}

function my_uuid_get (callback, callback_error) {
    var url = "{{ site.cog_api_url }}/my/useruuid/";
    get_auth(url, callback, callback_error);
}

function submission_add_files(callback, callback_error, uuid, file_lst) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/files/";
    var data = {'files': file_lst};
    put_auth(url, callback, callback_error, JSON.stringify(data));
}

function submission_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

function submission_get_files(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/files/";
    get_auth(url, callback, callback_error);
}

function submission_get_test(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/submissions/" + uuid + "/runs/";
    get_auth(url, callback, callback_error);
}

function submissions_get(callback, callback_error) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/submissions/";
    get_auth(url, callback, callback_error);
}

function submission_run_test(callback, callback_error, uuid_sub, uuid_tst) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/submissions/" + uuid_sub + "/runs/";
    var data = {'test': uuid_tst};
    post_auth(url, callback, callback_error, JSON.stringify(data));
}

function test_get(callback, callback_error, uuid) {
  dep(`call to deprecated function \`${arguments.callee.name}\``);
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
  dep(`call to deprecated function \`${arguments.callee.name}\``);
    var url = "{{ site.cog_api_url }}/runs/" + uuid + "/";
    get_auth(url, callback, callback_error);
}

(function(window, document) {

  var log = debug('cog-web:api');

  function COG(options) {
    this.url = options.url;
    this.token = options.token;

    var sub = this.token ? this.token.substring(0, 8) : undefined;
    log('constructing new interface object instance with token %s', sub);
  }

  /* internals */

  COG.prototype._ajax = function(options, callback) {
    // options.url = this.url + options.url;
    options.beforeSend = options.beforeSend || ((xhr) => {
      var header = util.generateBasicAuth(this.token);
      xhr.setRequestHeader('Authorization', header);
    });

    return $.ajax(options).then((data, status, xhr) => {
      callback(null, data, status, xhr);
    }, (xhr, status, err) => {
      callback(err, null, status, xhr);
    });
  };

  COG.prototype._binary = function(options, callback) {
    var header = util.generateBasicAuth(this.token);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Authorization', header);
    xhr.onload = function() {};
    xhr.send();
  };

  /* assignment accessors */

  COG.prototype.getAssignments = function(callback) {
    var endpoint = '/assignments/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getAssignmentsSubmittable = function(callback) {
    var endpoint = '/assignments/submitable/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getAssignment = function(uuid, callback) {
    var endpoint = '/assignments/' + uuid + '/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getAssignmentTests = function(uuid, callback) {
    var endpoint = '/assignments/' + uuid + '/tests/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getAssignmentSubmission = function(uuid, callback) {
    var endpoint = '/assignments/' + uuid + '/submissions/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  /* submission accessors */

  COG.prototype.getSubmissions = function(callback) {
    var endpoint = '/submissions/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getSubmission = function(uuid, callback) {
    var endpoint = '/submissions/' + uuid + '/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getSubmissionFiles = function(uuid, callback) {
    var endpoint = '/submissions/' + uuid + '/files/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  // TODO: review function name
  COG.prototype.getSubmissionTest = function(callback) {
    var endpoint = '/submissions/' + uuid + '/runs/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  /* files */

  COG.prototype.getFile = function(uuid, callback) {
    var endpoint = '/files/' + uuid + '/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getFileContents = function(uuid, callback) {
    var endpoint = '/files/' + uuid + '/contents/';
    var url = this.url + endpoint;
    log('dispatching request for binary data to `%s`', endpoint);
    return this._binary({ url }, callback);
  };

  /* other */

  COG.prototype.getTest = function(uuid, callback) {
    var endpoint = '/tests/' + uuid + '/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getRun = function(uuid, callback) {
    var endpoint = '/runs/' + uuid + '/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  /* user-specific resources */

  COG.prototype.getMyAssignmentSubmission = function(uuid, callback) {
    var endpoint = '/my/assignments/' + uuid + '/submissions/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getMySubmissionRun = function(uuid, callback) {
    var endpoint = '/my/submissions/' + uuid + '/runs/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  /* server-side resource creation */

  COG.prototype.postFile = function(data, callback, progress) {
    var endpoint = '/files/';
    var url = this.url + endpoint;

    var xhr = function() {
      var req = new XMLHttpRequest();

      req.upload.addEventListener('progress', function(event) {
        if (!event.lengthComputable) return;

        var percent = event.loaded / event.total;
        percent = parseInt(percent * 100);

        progress && progress(percent);
      }, false);

      return req;
    };

    return this._ajax({
      method: 'POST',
      url,
      data,
      xhr,
      contentType: false,
      cache: false,
      processData: false
    }, callback);
  };

  COG.prototype.addSubmissionFiles = function(uuid, files, callback) {
    var endpoint = '/submissions/' + uuid + '/files/';
    var url = this.url + endpoint;
    var data = JSON.stringify({ files });
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ method: 'PUT', url, data }, callback);
  };

  COG.prototype.createAssignmentSubmission = function(uuid, callback) {
    var endpoint = '/assignments/' + uuid + '/submissions/';
    var url = this.url + endpoint;
    var data = JSON.stringify({});
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ method: 'POST', url, data }, callback);
  };

  COG.prototype.runSubmissionTest = function(uuid, test, callback) {
    var endpoint = '/submissions/' + uuid + '/runs/';
    var url = this.url + endpoint;
    var data = JSON.stringify({ test });
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ method: 'POST', url, data }, callback);
  };

  var token = $.cookie('cog_token');
  window.cog = new COG({ url: '{{ site.cog_api_url }}', token });

})(window, document);
