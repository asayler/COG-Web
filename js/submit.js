/*global
  $, async, debug, cog
*/

var log = debug('cog-web:page:submit');

$(document).ready(function() {
  log('page initialization process started');
  var select = $('select#assignment');

  // fetch all the submittable assignments from the server
  cog.getAssignmentsSubmittable(function(err, data) {
    // now we have an array of assignment UUIDs
    var assignments = data.assignments;
    log('loaded %d assignment identifiers from the server', assignments.length);

    // inform the user if no assignments can be currently submitted
    if (!assignments.length) {
      var option = $('<option>').text('No Assignments Accepting Submissions');
      // only on initial load, no empty required
      select.append(option);
      return;
    }

    log('fetching metadata for individual assignments');
    async.map(assignments, cog.getAssignment.bind(cog), function(err, results) {
      log('received all assignment metadata from server');

      // after receiving all the assignment objects, clear the selector
      select.empty();
      log('populating assignment listing with received entries');
      populateAssignmentList(results);
    });
  });
});

function populateAssignmentList(list) {
  var elements = [];

  list.forEach(function(entry) {
    var uuid = Object.keys(entry)[0];
    var meta = entry[uuid];
    var option = $('<option>', { value: uuid }).text(meta.name);
    elements.push(option);
  });

  elements.sort(function(a, b) {
    var c = a.text().toLowerCase();
    var d = b.text().toLowerCase();

    if (c < d) return -1;
    if (c > d) return 1;
    return 0;
  });

  var str = elements.map(function(ele) {
    return ele.prop('outerHTML');
  }).join('');

  var select = $('select#assignment');
  select.html(str);
  select.prop('disabled', false);

  // select the last entry, as per old behavior
  // select.find('option:last').attr('selected', 'selected');
  select.val(select.children('option:last').val());
  select.change();
}

function populateTestList(list) {
  var elements = [];

  list.forEach(function(entry) {
    var uuid = Object.keys(entry)[0];
    var meta = entry[uuid];
    var option = $('<option>', { value: uuid }).text(meta.name);
    elements.push(option);
  });

  elements.sort(function(a, b) {
    var c = a.text().toLowerCase();
    var d = b.text().toLowerCase();

    if (c < d) return -1;
    if (c > d) return 1;
    return 0;
  });

  var str = elements.map(function(ele) {
    return ele.prop('outerHTML');
  }).join('');

  var select = $('select#test');
  select.html(str);
  select.prop('disabled', false);

  // select the last entry (assumed most recent)
  select.val(select.children('option:last').val());
  select.change();
}

$('select#assignment').change(function() {
  var sel = $(this).find(':selected');
  var uuid = sel.val();
  var text = sel.text();

  var select = $('select#test');

  log('assignment selector changed to `%s` (%s)', text, uuid.substring(0, 8));
  cog.getAssignmentTests(uuid, function(err, data) {
    // array of test UUIDs
    var tests = data.tests;

    log('loaded %d test options for assignment `%s`', tests.length, text);

    // inform the user if no tests are available
    if (!tests.length) {
      var option = $('<option>').text('No Tests Available');
      // empty previous assignment selection
      select.empty();
      select.append(option);
      // disable the test selector
      select.prop('disabled', true);
      // remove the max score, as there is no specified test
      $('span#max_score').text(0);
      // disable the file uploader
      $('input#file').prop('disabled', true);
      // disable the submit button
      $('button#submit').prop('disabled', true);
      return;
    }

    log('fetching metadata for individual tests');
    async.map(tests, cog.getTest.bind(cog), function(err, results) {
      log('received all test metadata from server');

      // after receiving all the test objects, clear the selector
      select.empty();
      log('populating test listing with received entries');
      populateTestList(results);
    });
  });
});

$('select#test').change(function() {
  var sel = $(this).find(':selected');
  var uuid = sel.val();
  var text = sel.text();
  log('test selector changed to `%s` (%s)', text, uuid.substring(0, 8));

  resetResults();
  cog.getTest(uuid, function(err, data) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var test = data[uuid];

    // update the maximum possible score indicator
    $('span#max_score').text(test.maxscore);
    // enable the file uploader
    $('input#file').prop('disabled', false);
    // enable the submit button
    $('button#submit').prop('disabled', false);
  });
});

function resetResults() {
  // reset run status, score, return code, UUID, and output dialogues
  $('span#run_status').text('TBD');
  $('span#run_score').text('TBD');
  $('span#run_retcode').text('TBD');
  $('span#run_uuid').text('TBD');
  $('pre#run_output').text('Grading output will appear here...');

  // reset the status label color
  $('span#run_status').removeClass(function(index, css) {
      return (css.match(/(^|\s)text-\S+/g) || []).join(' ');
  });

  // reset background color of output
  $('pre#run_output').css('background-color', '#f5f5f5');
}

$('form#submitform').submit(function(event) {
  event.preventDefault();

  $('button#submit').children('span.ladda-label').html('Running...');

  var assignment = $('select#assignment').val();
  var test = $('select#test').val();

  var fileName = $('input#file').val();
  var ext = fileName.split('.').pop();

  var field = (ext === 'zip') ? 'extract' : 'submission';
  $('input#file').attr('name', field);

  var form = new FormData($('form#submitform')[0]);

  // lock all form fields
  $('select#assignment').prop('disabled', true);
  $('select#test').prop('disabled', true);
  $('input#file').prop('disabled', true);

  $('div#file-progress').toggleClass('hidden');
  $('div#file-waiting').toggleClass('hidden');

  async.waterfall([
    function(callback) {
      file_post(function(data, status) {
        var files = data.files;
        callback(null, files);
      }, () => {}, function(percent) {
        // report file upload progress to the user
        $('span#upload-progress').text(percent);
      }, form);
    },
    function(files, callback) {
      assignment_submission_create(function(data, status) {
        var submission = data.submissions[0];
        callback(null, files, submission);
      }, () => {}, assignment);
    },
    function(files, submission, callback) {
      submission_add_files(function(data, status) {
        callback(null, submission);
      }, () => {}, submission, files);
    },
    function(submission, callback) {
      submission_run_test(function(data, status) {
        var run = data.runs[0];
        $('span#run_uuid').text(run);
        callback(null, run);
      }, () => {}, submission, test);
    }
  ], function(err, run) {
    pollResults(run);
  });
});

function pollResults(run) {
  cog.getRun(run, function(err, data) {
    // extract results from the run
    var keys = Object.keys(data);
    var uuid = keys[0];
    var run = data[uuid];

    // display the status of the run
    $('span#run_status').text(run.status);

    // define colors to be associated with each run
    var colors = {
      text: {
        'success' : 'text-success',
        'warning': 'text-warning',
        'exception': 'text-danger',
        'error': 'text-danger'
      },
      bg: {
        'success': '#edf7f2',
        'warning': '#f7f7ed',
        'exception': '#f7edf2',
        'error': '#f7edf2'
      }
    };

    // clear run status of color classes before applying a new one
    $('span#run_status').removeClass(function(index, css) {
        return (css.match(/(^|\s)text-\S+/g) || []).join(' ');
    });

    // apply relevant background color to status
    var sub = run.status.split('-');
    if (sub.length > 1) {
      var type = sub[1];
      $('span#run_status').addClass(colors.text[type]);
      $('pre#run_output').css('background-color', colors.bg[type]);
    } else {
      $('span#run_status').addClass(colors.text['success']);
      $('pre#run_output').css('background-color', colors.bg['success']);
    }

    if (run.status.indexOf('complete') === 0) {
      // display program output
      $('span#run_score').text(run.score);
      $('span#run_retcode').text(run.retcode);
      $('pre#run_output').text(run.output);

      // unlock all form elements, the run is complete
      $('select#assignment').prop('disabled', false);
      $('select#test').prop('disabled', false);
      $('input#file').prop('disabled', false);
      $('button#submit').children('span.ladda-label').html('Submit');

      // hide progress bar and revert to waiting status
      $('div#file-progress').toggleClass('hidden');
      $('div#file-waiting').toggleClass('hidden');
    } else {
      setTimeout(pollResults, 1000);
    }
  });
}
