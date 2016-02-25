function sort_table() {
	console.log("Sort the table");
}

function show_history() {
    // Get previous submissions
    console.log("Get previous submissions...");

    submissions_get(display_history, submit_error_callback);
}

function display_history(data, status) {
	var subm = data.submissions;

	$.each(subm, function(index, uuid) {
		submission_get(create_table_entry, submit_error_callback, uuid);
	});
}

function create_table_entry(data, status) {
	var uuid = Object.keys(data)[0];
	var row = []; // Array of JSON objects to add to the table

	// Add time
	append_time(data[uuid]);

	function append_time(submission) {
		var row_time = {};
		var mseconds= submission.modified_time;
		var mtime = new Date(0);
		mtime.setUTCSeconds(mseconds);
		
		//console.log("TIME " + mtime.toDateString());

		row_time.time = mtime.toDateString();
		row.push(row_time);

		if (row.length == 5) {
			append_row(row);
		}
	}

	// Add assginment name
	assignment_get(append_name, submit_error_callback, data[uuid].assignment);
	
	function append_name(data, status) {
		var row_name = {};
		var uuid = Object.keys(data)[0];

		var assigment_name = data[uuid].name;

		//console.log("TEST NAME " + assigment_name);
		row_name.aname = assigment_name;
		row.push(row_name);

		if (row.length == 5) {
			append_row(row);
		}
	}

	// Add files
	submission_get_files(find_files, submit_error_callback, uuid);

	function find_files(data, status) {
		var array_length = data.files.length;
		var file_array = [];

		$.each(data.files, function(index, uuid) {
			file_get(append_files, submit_error_callback, uuid);

			function append_files(data, status) {
				var f = {};

				var uuid = Object.keys(data)[0];

				var file_name = data[uuid].name;

				f.name = file_name;
				f.uuid = uuid;

				file_array.push(JSON.stringify(f));

				// Account for length of the array
				if(file_array.length == array_length) {
					row.push(file_array);

					if (row.length == 5) {
						append_row(row);
					}
				}

				// Log Submission
				//console.log("FILE NAME " + file_name);
				//console.log("FILE UUID " + uuid);
			}
		});
	}

	// Add grade
	submission_get_test(find_grade, submit_error_callback, uuid);

	function find_grade(data, status) {
		run_get(append_grade, submit_error_callback, data.runs);

		function append_grade(data, status) {
			var row_grade = {};
			var row_output = {};
			var uuid = Object.keys(data)[0];

			var grade = data[uuid].score;
			var output = data[uuid].output;

			//console.log("GRADE " + grade);
			//console.log("OUTPUT " + output);

			row_grade.grade = grade;
			row_output.output = output;

			row.push(row_grade);
			row.push(row_output);

			if (row.length == 5) {
				append_row(row);
			}
		}
	}
}

// aname, time, grade, output
function append_row(row) {
	var row_object = to_object(row);

	var time = row_object.time;
	var assigment_name = row_object.aname;
	var grade = row_object.grade;
	var files = row_object.files;

	$("#history_table").append("<tr><td>" + time + "</td><td>" + assigment_name + "</td><td>" + files + "</td><td>" + grade + "</td></tr>");

	sort_table();
}

function to_object(row) {
	row_object = {};
	$.each(row, function(index, value) {
		if (isArray(value)) {
			var file_names = "";

			$.each(value, function(index, val) {
				var file_obj = JSON.parse(val);

				file_names += file_obj.name;
				file_names += ", ";
			});

			row_object.files = file_names.slice(0, -2);
		} else {
			if ('time' in value) {
				row_object.time = value.time;
			}
			if ('aname' in value) {
				row_object.aname = value.aname;
			}
			if ('grade' in value) {
				row_object.grade = value.grade;
			}
			if ('output' in value) {
				row_object.output = value.output;
			}
		}
	});

	return row_object;
}

function isArray(x) {
    return x.constructor.toString().indexOf("Array") > -1;
}

function submit_error_callback(xhr, status, error) {
    // Log Error
    console.log("Status: " + status, ", Error: " + error);
}