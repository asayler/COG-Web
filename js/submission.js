---
---

/*global
  $, cog, util, debug, async
*/

(function(window, document) {

  var log = debug('cog-web:page:submission');

  $(document).ready(function() {

    var uuid = util.getQueryParameter('uuid');
    log('attempting to fetch file listing for submission %s', uuid);

    cog.getSubmissionFiles(uuid, function(err, data) {
      // contains an array of file UUIDs
      var files = data.files;
      log('loaded %d file identifier(s) from the server', files.length);

      log('fetching metadata for individual files');
      async.map(files, cog.getFile.bind(cog), function(err, results) {
        log('received all file metadata from server');
        log('populating file listing with received entries');
        populateFileList(results);
      });

    });

  });

  // delegate events off of the table for dynamic handling
  $('#files_table').delegate('.auth-dl', 'click', function(event) {
    event.preventDefault();

    var uuid = $(this).data('uuid');
    var name = $(this).data('name');

    log('used requested binary contents for file %s', uuid);
    cog.getFileContents(uuid, function(err, blob) {
      log('blob received from server, converting to URL object');
      var url = window.URL.createObjectURL(blob);

      var a = document.createElement('a');
      a.style = 'display: none';
      a.href = url;
      a.download = name;

      $(document.body).append(a);
      a.click();
      log('triggering download dialogue for file %s', uuid);

      // permit time for deferred events to execute
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
      }, 100);
    });
  });

  function populateFileList(list) {
    var elements = [];

    list.forEach(function(entry) {
      var uuid = Object.keys(entry)[0];
      var meta = entry[uuid];

      elements.push({ uuid, name: meta.name });
    });

    elements.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    // interpolating the API URL outside of a constants file is not ideal
    // TODO: fix this
    var str = elements.map(function(ele) {
      return [
        '<tr><td>',
        ele.name,
        '</td><td><a class="auth-dl" href="',
        '{{ site.cog_api_url }}/files/', ele.uuid, '/contents/',
        '" data-name="', ele.name,
        '" data-uuid="', ele.uuid,
        '">', ele.uuid, '</a></td></tr>'
      ].join('');
    }).join('');

    $('#files-table').append(str);
  }

})(window, document);
