var TABLE_ROW_LENGTH = 5; // TO-DO remove
var NUM_ROW_ENTRIES  = 5;
var asn_cnt      	 = null;
var asn_uuid         = null;
var tst_cnt          = null;
var tst_uuid         = null;
var ladda_submit     = null;

function sort_table() {
	console.log("Sort the table");
}

function show_history() {
    // Get previous submissions
    console.log("Get previous submissions...");

    ladda_submit = $("button#submit").ladda();

    assignments_get_submitable(update_asn_list, setup_error_callback);
}

function display_my_history() {
	console.log("in my history " + asn_uuid + " " + tst_uuid);

	assignment_submission_get(find_submissions, submit_error_callback, asn_uuid);
}

function find_submissions(data, status) {
	$.each(data.submissions, function(index, uuid) {
		submission_get(append_table_entry, submit_error_callback, uuid);
	});
}

function append_table_entry(data, status) {
	console.log(JSON.stringify(data));
	var uuid = Object.keys(data)[0];
	var new_row = {};

	// Get the time
	append_time(data[uuid]);

	function append_time(submission) {
		var mseconds= submission.modified_time;
		var mtime = new Date(0);
		mtime.setUTCSeconds(mseconds);

		new_row.mtime = mtime.toUTCString();

		console.log(new_row.mtime);

		if (Object.keys(new_row).length == NUM_ROW_ENTRIES) {
			append_row(new_row);
		}
	}

	// Get retcode, score and status
	submission_get_test(get_run_info, submit_error_callback, uuid);

	function get_run_info(data, status) {
		run_get(append_run_info, submit_error_callback, data.runs);

		function append_run_info(data, status) {
			var uuid = Object.keys(data)[0];

			new_row.score = data[uuid].score;
			new_row.retcode = data[uuid].retcode;
			new_row.status = data[uuid].status;
			new_row.test = data[uuid].test;


			if (Object.keys(new_row).length == NUM_ROW_ENTRIES) {
				append_row(new_row);
			}
		}
	}
}

// Create the HTML for the row
function append_row(row) {
	// if (output.length > 100) {
	// 	more_output = "<a href='/output.html'>...view more</a>";
	// 	// add the uuid and set it in a cookie
	// }

	if (row.test == tst_uuid) {
		$("#history_table").append("<tr><td>" + row.time + "</td><td>" + row.score + "</td><td>" + row.retcode "</td><td>" + row.status + "</td></tr>");
	}

	stop_spin();
}

function stop_spin() {
    $("select#assignment").prop("disabled", false);
    $("select#test").prop("disabled", false);

    ladda_submit.ladda("stop");

    $("button#submit").children("span.ladda-label").html("Search");
}

// function create_table_entry(data, status) {
// 	// Add assginment name
// 	assignment_get(append_name, submit_error_callback, data[uuid].assignment);
	
// 	function append_name(data, status) {
// 		var row_name = {};
// 		var uuid = Object.keys(data)[0];

// 		var assigment_name = data[uuid].name;

// 		//console.log("TEST NAME " + assigment_name);
// 		row_name.aname = assigment_name;
// 		row.push(row_name);

// 		if (row.length == TABLE_ROW_LENGTH) {
// 			append_row(row);
// 		}
// 	}

// 	// Add files
// 	submission_get_files(find_files, submit_error_callback, uuid);

// 	function find_files(data, status) {
// 		var array_length = data.files.length;
// 		var file_array = [];

// 		$.each(data.files, function(index, uuid) {
// 			file_get(append_files, submit_error_callback, uuid);

// 			function append_files(data, status) {
// 				var f = {};

// 				var uuid = Object.keys(data)[0];

// 				var file_name = data[uuid].name;

// 				f.name = file_name;
// 				f.uuid = uuid;

// 				file_array.push(JSON.stringify(f));

// 				// Account for length of the array
// 				if(file_array.length == array_length) {
// 					row.push(file_array);

// 					if (row.length == TABLE_ROW_LENGTH) {
// 						append_row(row);
// 					}
// 				}

// 				// Log Submission
// 				//console.log("FILE NAME " + file_name);
// 				//console.log("FILE UUID " + uuid);
// 			}
// 		});
// 	}

// 	// Add tests
// 	submission_get_test(get_run_information, submit_error_callback, uuid);

// 	function get_run_information(data, status) {
// 		run_get(find_test_name, submit_error_callback, data.runs);

// 		function find_test_name(data, status) {
// 			var inner_uuid = Object.keys(data)[0];

// 			test_get(append_test_name, submit_error_callback, data[inner_uuid].test);

// 			function append_test_name(data, status) {
// 				var row_test_name = {};
// 				var test_uuid = Object.keys(data)[0];
// 				var test_name = data[test_uuid].name;

// 				row_test_name.tname = test_name;

// 				row.push(row_test_name);
				
// 				if (row.length == TABLE_ROW_LENGTH) {
// 					append_row(row);
// 				}
// 			}
// 		}
// 	}

// 	// Add grade
// 	submission_get_test(find_grade, submit_error_callback, uuid);

// 	function find_grade(data, status) {
// 		run_get(append_grade, submit_error_callback, data.runs);

// 		function append_grade(data, status) {
// 			var row_grade = {};
// 			var row_output = {};
// 			var uuid = Object.keys(data)[0];

// 			var grade = data[uuid].score;
// 			var output = data[uuid].output;

// 			//console.log("GRADE " + grade);
// 			//console.log("OUTPUT " + output);

// 			row_grade.grade = grade;
// 			row_output.output = output;

// 			row.push(row_grade);
// 			row.push(row_output);

// 			if (row.length == TABLE_ROW_LENGTH) {
// 				append_row(row);
// 			}
// 		}
// 	}
// }

function isArray(x) {
    return x.constructor.toString().indexOf("Array") > -1;
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