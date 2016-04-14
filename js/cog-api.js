---
---

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
    var self = this;
    // options.url = this.url + options.url;
    options.beforeSend = options.beforeSend || function(xhr) {
      var header = util.generateBasicAuth(self.token);
      xhr.setRequestHeader('Authorization', header);
    };

    return $.ajax(options).then(function(data, status, xhr) {
      callback(null, data, status, xhr);
    }, function(xhr, status, err) {
      callback(err, null, status, xhr);
    });
  };

  COG.prototype._binary = function(options, callback) {
    var header = util.generateBasicAuth(this.token);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', options.url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Authorization', header);

    xhr.onload = function() {
      if (this.status === 200) {
        var blob = this.response;
        return callback(null, blob);
      }

      var e = new Error('Server returned unexpected status');
      callback(e);
    };

    xhr.send();
  };

  /* assignments */

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

  COG.prototype.getAssignmentSubmissions = function(uuid, callback) {
    var endpoint = '/assignments/' + uuid + '/submissions/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  /* submissions */

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

  COG.prototype.getSubmissionRuns = function(callback) {
    var endpoint = '/submissions/' + uuid + '/runs/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  /* files */

  COG.prototype.getFiles = function(callback) {
    var endpoint = '/files/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

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

  /* users */

  COG.prototype.getUsers = function(callback) {
    var endpoint = '/users/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getUsersNamelist = function(callback) {
    var endpoint = '/users/usernames/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getUser = function(uuid, callback) {
    var endpoint = '/users/' + uuid + '/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getUserAssignmentSubmissions = function(user, uuid, callback) {
    var endpoint = '/users/' + user + '/assignments/' + uuid + '/submissions/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getUserSubmissionRuns = function(user, uuid, callback) {
    var endpoint = '/users/' + user + '/submissions/' + uuid + '/runs/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
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

  COG.prototype.getMyAssignmentSubmissions = function(uuid, callback) {
    var endpoint = '/my/assignments/' + uuid + '/submissions/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  }

  COG.prototype.getMyIsadmin = function(callback) {
    var endpoint = '/my/isadmin/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getMySubmissionRuns = function(uuid, callback) {
    var endpoint = '/my/submissions/' + uuid + '/runs/';
    var url = this.url + endpoint;
    log('dispatching request to `%s`', endpoint);
    return this._ajax({ url }, callback);
  };

  COG.prototype.getMyUniqueId = function(callback) {
    var endpoint = '/my/useruuid/';
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
