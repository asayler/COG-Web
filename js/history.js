var NUM_ROW_ENTRIES  = 7;
var rows             = [];
var num_disp_subm    = 0;
var num_added_subm   = 0;
var num_subm         = null;
var asn_cnt      	 = null;
var asn_uuid         = null;
var tst_cnt          = null;
var tst_uuid         = null;
var ladda_submit     = null;

function show_history() {
    // Get previous submissions
    console.log("Get previous submissions...");

    ladda_submit = $("button#submit").ladda();

    assignments_get_submitable(update_asn_list, setup_error_callback);
}

function display_my_history() {
	assignment_submission_get(find_submissions, submit_error_callback, asn_uuid);
}

function find_submissions(data, status) {
	num_subm = data.submissions.length;

	$.each(data.submissions, function(index, uuid) {
		submission_get(append_table_entry, submit_error_callback, uuid);
	});
}

function append_table_entry(data, status) {
	var uuid = Object.keys(data)[0];
	var new_row = {};

	new_row.uuid = uuid;

	// Get the time
	append_time(data[uuid]);

	function append_time(submission) {
		var mseconds= submission.modified_time;
		var mtime = new Date(0);
		mtime.setUTCSeconds(mseconds);

		new_row.mtime = mtime; //.toLocaleString();

		if (Object.keys(new_row).length == NUM_ROW_ENTRIES) {
			create_row(new_row);
		}
	}

	// Get retcode, score and status
	submission_get_test(get_run_info, submit_error_callback, uuid);

	function get_run_info(data, status) {
		run_get(append_run_info, submit_error_callback, data.runs);

		function append_run_info(data, status) {
			var uuid = Object.keys(data)[0];
			var color;

			new_row.score = data[uuid].score;
			new_row.retcode = data[uuid].retcode;
			new_row.status = data[uuid].status;
			new_row.test = data[uuid].test;

			// Define colors for each type of status
		    var colors = {
		        text: {
		            "success" : "text-success",
		            "warning": "text-warning",
		            "exception": "text-danger",
		            "error": "text-danger"
		        },
		        bg: {
		            "success": "#edf7f2",
		            "warning": "#f7f7ed",
		            "exception": "#f7edf2",
		            "error": "#f7edf2"
		        }
		    };

		    var color;

			// Set status color
			if (new_row.status) {
			    var sub = new_row.status.split('-');

			    if (sub.length > 1) {
				    var type = sub[1];

				    color = colors.text[type];
				} else {
					color = colors.text.success;
				}

			} else {
				color = "#000000";
			}

			new_row.color = color;

			if (Object.keys(new_row).length == NUM_ROW_ENTRIES) {
				create_row(new_row);
			}
		}
	}
}

// Create the row array
function create_row(row) {
	rows.push(row);

	num_added_subm++;

	if (num_added_subm == num_subm) {
		sort_table();
	}
}

// Create the HTML for the row
function append_row(row) {
	var sub = encodeURI("?sub=" + row.uuid);
	var url = "/output.html" + sub;
	console.log(url);

	var see_more = "<a href='" + url + "'>More Information</a>";

	var row_entry = "<tr><td>" + row.mtime.toLocaleString() + "</td><td>" + row.score + "</td><td>" 
			+ row.retcode + "</td><td class='" + row.color + "'>" + row.status 
			+ "</td><td>" + see_more + "</td></tr>";

	if (row.test == tst_uuid) {
		$("#history_table").append(row_entry);
	}

	num_disp_subm++;

	if (num_disp_subm == num_subm) {
		stop_spin();

		rows = [];
		num_disp_subm = 0;
		num_added_subm = 0;
		num_subm = 0;
	}
}

function sort_table() {
    rows.sort(function(x, y) {
    	return x.mtime - y.mtime;
	});

	$.each(rows, function(index, row) {
		append_row(row);
	});
}

function stop_spin() {
    $("select#assignment").prop("disabled", false);
    $("select#test").prop("disabled", false);

    ladda_submit.ladda("stop");

    $("button#submit").children("span.ladda-label").html("Search");
}

// Duplicate code from submit.js
function add_option_alpha(select, option) {
    var inserted = false;
    select.children("option").each(function() {
	    if (option.text() < this.text) {
	        console.log("Inserting " + option.text());
	        option.insertBefore(this);
	        inserted = true;
	        return false;
        }
    });
    if ( inserted == false ) {
	    console.log("Appending " + option.text());
	    select.append(option);
	    inserted = true;
    }
}

function update_asn_list(data, status) {
    var assignments = data.assignments;
    var select = $("select#assignment");
    select.empty();
    asn_cnt = assignments.length;
    console.log("asn_cnt = " + asn_cnt);
    console.log("assignments = " + assignments);
    if(asn_cnt > 0) {
        $.each(assignments, function(key, uuid) {
            assignment_get(update_asn_list_item, setup_error_callback, uuid);
        });
    }
    else {
	    var option = $("<option>", { value : ""}).text("No Assignments Accepting Submissions");
        select.append(option);
        select.prop("disabled", true);
    }
}

function update_asn_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var assignment = data[uuid];
    var select = $("select#assignment");
    var option = $("<option>", { value : uuid}).text(assignment.name);
    add_option_alpha(select, option);
    if ( select.children("option").size() == asn_cnt ) {
	    select.val(select.children("option:last").val());
        select.change();
        select.prop("disabled", false);
    }
}

function update_tst_list(data, status) {
    var tests = data.tests;
    var select = $("select#test");
    select.empty();
    tst_cnt = tests.length;
    console.log("tst_cnt = " + tst_cnt);
    console.log("tests = " + tests);
    if(tst_cnt > 0) {
        $.each(tests, function(key, uuid) {
            test_get(update_tst_list_item, setup_error_callback, uuid);
        });
    }
    else {
	    var option = $("<option>", { value : ""}).text("No Tests Accepting Submissions");
        select.append(option);
        select.prop("disabled", true);
        $("input#file").prop("disabled", true);
        $("button#submit").prop("disabled", true);
    }
}

function update_tst_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var test = data[uuid];
    var select = $("select#test");
    var option = $("<option>", { value : uuid}).text(test.name);
    add_option_alpha(select, option);
    if (select.children("option").size() == tst_cnt) {
	    select.val(select.children("option:last").val());
        select.change();
        select.prop("disabled", false);
        $("input#file").prop("disabled", false);
        $("button#submit").prop("disabled", false);
    }
}

function setup_error_callback(xhr, status, error) {
    // Log Error
    console.log("Status: " + status, ", Error: " + error);
}

function submit_error_callback(xhr, status, error) {
    // Log Error
    console.log("Status: " + status, ", Error: " + error);
}


$("select#assignment").change(function() {
    var uuid = $("select#assignment").val();
    console.log("Assignment changed to " + uuid)
    if(uuid.length > 0) {
        assignment_tests_get(update_tst_list, setup_error_callback, uuid);
    }
});

$("select#test").change(function() {
    var uuid = $("select#test").val();
    console.log("Test changed to " + uuid)
    if(uuid.length > 0) {
        // clear_results(); // Potentially add this back in!
        // test_get(update_max_score, setup_error_callback, uuid);
    }
});

$("form#submitform").submit(function(event) {
    event.preventDefault();

    // Start Button Animation
    ladda_submit.ladda("start");
    $("button#submit").children("span.ladda-label").html("Searching...");

    // Get Input
    asn_uuid = $("select#assignment").val();
    tst_uuid = $("select#test").val();

    // Validate Data
    if (!asn_uuid || asn_uuid.length !== 36) {
        console.log("Valid Assignment UUID Required");
        $("button#submit").prop("disabled", false);
        return;
    }

    if (!tst_uuid || tst_uuid.length !== 36) {
        console.log("Valid Test UUID Required");
        $("button#submit").prop("disabled", false);
        return;
    }

    //submissions_get(display_history, submit_error_callback);

    // Clear table
    $("#history_table tbody tr").remove(); 

    display_my_history();

    // Lock Form
    $("select#assignment").prop("disabled", true);
    $("select#test").prop("disabled", true);
    $("input#file").prop("disabled", true);
});
// End code from submit.js