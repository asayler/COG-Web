/*global
  $, cog, util, debug
*/

(function(window, document) {

  var log = debug('cog-web:page:run');

  $(document).ready(function() {

    var uuid = util.getQueryParameter('uuid');
    log('attempting to fetch run result record for %s', uuid);

    cog.getRun(uuid, function(err, data) {
      if (err) {
        log('failed to retreive run data for %s, error: %s', uuid, err);
        return;
      }

      log('successfully received data for run %s', uuid);
      displayRun(data);
    });

  });

  function displayRun(meta) {
    var uuid = Object.keys(meta)[0];
    var entry = meta[uuid];

    log('populating page with run data for %s', uuid);

    $('span#run_uuid').text(uuid);
		$('span#run_score').text(entry.score);
		$('span#run_retcode').text(entry.retcode);
		$('span#run_status').text(entry.status);
		$('pre#run-output').text(entry.output);
		$('pre#max_score').text(entry.maxscore);

    // define colors for each type of status
    var colors = {
      'success' : 'text-success',
      'warning': 'text-warning',
      'exception': 'text-danger',
      'error': 'text-danger'
    };

    // apply relevant color to status indicator
    var sub = entry.status.split('-');
    var color = (sub.length > 1) ? colors[sub[1]] : colors.success;
    $('span#run_status').addClass(color);
  }

})(window, document);
