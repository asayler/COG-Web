var asn_uuid  = null;
var tst_uuid  = null;
var fle_uuids = null;
var sub_uuid  = null;
var run_uuid  = null;
var timeout = null;
var ladda_submit = null;

function submit_onload() {
    ladda_submit = Ladda.create(document.querySelector("button#submit"));
    assignments_get_submitable(update_asn_list, setup_error_callback);
}

function update_asn_list(data, status) {
    $("select#assignment").empty();
    var assignments = data.assignments;
    console.log("assignments = " + assignments);
    if(assignments.length > 0) {
        $.each(assignments, function(key, value) {
            var uuid = value;
            assignment_get(update_asn_list_item, setup_error_callback, uuid);
        });
    }
    else {
        $("select#assignment")
            .append($("<option>", { value : ""})
                    .text("No Assignments Accepting Submissions"));
        $("select#assignment").prop("disabled", true);
    }
}

function update_asn_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var assignment = data[uuid];
    $("select#assignment")
        .append($("<option>", { value : uuid})
                .text(assignment.name));
    if ($("select#assignment").prop("disabled")) {
        $("select#assignment").prop("disabled", false);
        $("select#assignment").change();
    }
}

function update_tst_list(data, status) {
    $("select#test").empty();
    var tests = data.tests;
    console.log("tests = " + tests);
    if(tests.length > 0) {
        $.each(tests, function(key, value) {
            var uuid = value;
            test_get(update_tst_list_item, setup_error_callback, uuid);
        });
    }
    else {
        $("select#test")
            .append($("<option>", { value : ""})
                    .text("No Tests Accepting Submissions"));
        $("select#test").prop("disabled", true);
        $("input#file").prop("disabled", true);
        $("button#submit").prop("disabled", true);
    }
    clear_results()
}

function update_tst_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var test = data[uuid];
    $("select#test")
        .append($("<option>", { value : uuid})
                .text(test.name));
    if ($("select#test").prop("disabled")) {
        $("select#test").prop("disabled", false);
        $("input#file").prop("disabled", false);
        $("button#submit").prop("disabled", false);
        $("select#test").change();
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

    if(run.status.indexOf("complete") == 0) {

        // Output Results
        $("span#run_score").text(run.score);
        $("span#run_retcode").text(run.retcode);
        $("pre#run_output").text(run.output);

        // Unlock Form
        $("select#assignment").prop("disabled", false);
        $("select#test").prop("disabled", false);
        $("input#file").prop("disabled", false);
	    ladda_submit.stop();
        $("button#submit").children("span.ladda-label").html("Submit");

    }
    else {

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
	ladda_submit.stop();
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
    $("span#run_status").text("TBD");
    $("span#run_score").text("TBD");
    $("span#run_retcode").text("TBD");
    $("span#run_uuid").text("TBD");
    $("pre#run_output").text("Grading output will appear here...");
}

$("select#assignment").change(function() {
    var uuid = $("select#assignment").val();
    if(uuid.length > 0) {
        assignment_tests_get(update_tst_list, setup_error_callback, uuid);
    }
});

$("select#test").change(function() {
    var uuid = $("select#test").val();
    if(uuid.length > 0) {    
        test_get(update_max_score, setup_error_callback, uuid);
    }
});

$("form#submitform").submit(function() {

    // Start Button Animation
    ladda_submit.start();
    $("button#submit").children("span.ladda-label").html("Running...");
    
    // Get Input
    asn_uuid = $("select#assignment").val();
    tst_uuid = $("select#test").val();

    // Validate Data
    if((!asn_uuid) || (asn_uuid.length != 36)) {
        console.log("Valid Assignment UUID Required");
        $("button#submit").prop("disabled", false);
        return false;
    }
    if((!tst_uuid) || (tst_uuid.length != 36)) {
        console.log("Valid Test UUID Required");
        $("button#submit").prop("disabled", false);
        return false;
    }
    if($("input#file").val().length == 0) {
        console.log("Valid File Required");
        $("button#submit").prop("disabled", false);
        return false;
    }

    // Upload File
    var file_name = $("input#file").val();
    console.log("File Name = " + file_name);
    var file_ext = file_name.split('.').pop();
    console.log("File Extension = " + file_ext);
    if(file_ext == "zip") {
        $("input#file").attr('name', 'extract')
    }
    else {
        $("input#file").attr('name', 'submission')
    }
    var form_data = new FormData($('form#submitform')[0]);
    console.log("Submitting File...");
    file_post(upload_fle_callback, submit_error_callback, form_data);

    // Lock Form
    $("select#assignment").prop("disabled", true);
    $("select#test").prop("disabled", true);
    $("input#file").prop("disabled", true);

    // Return
    return false
    
});
