var asn_cnt      = null;
var asn_uuid     = null;
var tst_cnt      = null;
var tst_uuid     = null;
var fle_uuids    = null;
var sub_uuid     = null;
var run_uuid     = null;
var timeout      = null;
var ladda_submit = null;

//dummy line

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

function submit_onload() {
    ladda_submit = $("button#submit").ladda();
    assignments_get_submitable(update_asn_list, setup_error_callback);
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

// Submission Sequence

function upload_fle_callback(data, status) {

    // Log Data
    console.log("data = " + JSON.stringify(data));

    // Save Files UUIDs
    fle_uuids = data.files;

    // Create Submission
    console.log("Creating Submission...");
    assignment_submission_create(create_sub_callback, submit_error_callback, asn_uuid);

}

function create_sub_callback(data, status) {

    // Log Data
    console.log("data = " + JSON.stringify(data));

    // Save Submission UUID
    sub_uuid = data.submissions[0];

    // Add Files to Submission
    var file_lst = fle_uuids;
    console.log("Adding Files...");
    submission_add_files(add_files_callback, submit_error_callback, sub_uuid, file_lst);

}

function add_files_callback(data, status) {

    // Log Data
    console.log("data = " + JSON.stringify(data));

    // Check Files
    console.log("Added files: " + data.files);

    // Launch Test Run
    console.log("Starting Test Run...");
    submission_run_test(run_test_callback, submit_error_callback, sub_uuid, tst_uuid);

}

function run_test_callback(data, status) {

    // Log Data
    console.log("data = " + JSON.stringify(data));

    // Save Run UUID
    run_uuid = data.runs[0];

    // Log to Console
    console.log("asn_uuid  = " + asn_uuid);
    console.log("tst_uuid  = " + tst_uuid);
    console.log("fle_uuids = " + fle_uuids);
    console.log("sub_uuid  = " + sub_uuid);
    console.log("run_uuid  = " + run_uuid);

    // Output UUID
    $("span#run_uuid").text(run_uuid);

    // Check Results
    poll_results_callback()

}

function poll_results_callback() {

    // Update Results
    console.log("Getting Run Results...");
    run_get(check_result_callback, submit_error_callback, run_uuid);

}

function check_result_callback(data, status) {
    // Log Data
    console.log("data = " + JSON.stringify(data));

    // Extract Results
    var keys = Object.keys(data);
    var uuid = keys[0];
    var run = data[uuid];

    // Update Status
    $("span#run_status").text(run.status);

    // Define colors for each type of status
    var colors = {
        text: {
            "success" : "text-success",
            "exception": "text-warning",
            "error": "text-danger"
        },
        bg: {
            "success": "#edf7f2",
            "exception": "#f7f7ed",
            "error": "#f7edf2"
        }
    };

    // Drop text classes before another is applied
    $("span#run_status").removeClass(function(index, css) {
        return (css.match (/(^|\s)text-\S+/g) || []).join(' ');
    });

    // Apply relevant background color to status
    var sub = run.status.split('-');
    if (sub.length > 1) {
        var type = sub[1];
        console.log('Received completion error: ' + type);

        $("span#run_status").addClass(colors.text[type]);
        $("pre#run_output").css("background-color", colors.bg[type]);
    } else {
        $("span#run_status").addClass(colors.text["success"]);
        $("pre#run_output").css("background-color", colors.bg["success"]);
    }

    if (run.status.indexOf("complete") === 0) {

        // Output Results
        $("span#run_score").text(run.score);
        $("span#run_retcode").text(run.retcode);
        $("pre#run_output").text(run.output);

        // Unlock Form
        $("select#assignment").prop("disabled", false);
        $("select#test").prop("disabled", false);
        $("input#file").prop("disabled", false);
	    ladda_submit.ladda("stop");
        $("button#submit").children("span.ladda-label").html("Submit");

        // Hide progress bar and revert to waiting status
        $('div#file-progress').toggleClass('hidden');
        $('div#file-waiting').toggleClass('hidden');

    } else {
        // Start Polling
        console.log("Waiting...");
        timeout = setTimeout(poll_results_callback, 1000);
    }
}

function update_max_score(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var tst = data[uuid];
    $("span#max_score").text(tst.maxscore);
}

function submit_error_callback(xhr, status, error) {

    // Log Error
    console.log("Status: " + status, ", Error: " + error);

    // Update Status
    $("span#run_status").text("API Error: " + error);

    // Output Results
    $("span#run_score").text("N/A");
    $("span#run_retcode").text("N/A");
    $("pre#run_output").text(xhr.responseText);

    // Unlock Form
    $("select#assignment").prop("disabled", false);
    $("select#test").prop("disabled", false);
    $("input#file").prop("disabled", false);
	ladda_submit.ladda("stop");
    $("button#submit").children("span.ladda-label").html("Submit");

}

function setup_error_callback(xhr, status, error) {

    // Log Error
    console.log("Status: " + status, ", Error: " + error);

    // Update Status
    $("span#run_status").text("API Error: " + error);

    // Output Results
    $("span#run_score").text("N/A");
    $("span#run_retcode").text("N/A");
    $("pre#run_output").text(xhr.responseText);

}

function clear_results() {
    // Remove status color from previous runs
    $("span#run_status").removeClass(function(index, css) {
        return (css.match (/(^|\s)text-\S+/g) || []).join(' ');
    });

    // Reset run output background
    $("pre#run_output").css("background-color", "#f5f5f5");

    $("span#run_status").text("TBD");
    $("span#run_score").text("TBD");
    $("span#run_retcode").text("TBD");
    $("span#run_uuid").text("TBD");
    $("pre#run_output").text("Grading output will appear here...");
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
        clear_results();
        test_get(update_max_score, setup_error_callback, uuid);
    }
});

$("form#submitform").submit(function(event) {
    event.preventDefault();

    // Start Button Animation
    ladda_submit.ladda("start");
    $("button#submit").children("span.ladda-label").html("Running...");

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

    if ($("input#file").val().length === 0) {
        console.log("Valid File Required");
        $("button#submit").prop("disabled", false);
        return;
    }

    // Upload File
    var file_name = $("input#file").val();
    console.log("File Name = " + file_name);

    var file_ext = file_name.split(".").pop();
    console.log("File Extension = " + file_ext);

    if (file_ext === "zip") {
        $("input#file").attr("name", "extract")
    } else {
        $("input#file").attr("name", "submission")
    }

    var form_data = new FormData($("form#submitform")[0]);
    console.log("Submitting File...");

    $('div#file-progress').toggleClass('hidden');
    $('div#file-waiting').toggleClass('hidden');

    file_post(upload_fle_callback, submit_error_callback, function(percent) {
        // Report file upload progress to the user
        $('span#upload-progress').text(percent);
    }, form_data);

    // Lock Form
    $("select#assignment").prop("disabled", true);
    $("select#test").prop("disabled", true);
    $("input#file").prop("disabled", true);
});
