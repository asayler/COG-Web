var asn_uuid = null;
var tst_uuid = null;
var fle_uuid = null;
var sub_uuid = null;
var run_uuid = null;

function submit_onload() {
    $("span#current_user").text($.cookie(COOKIE_USER_NAME));    
    assignments_get(update_asn_list);
    $("select#assignment").change();
}

function update_asn_list(data, status) {
    $("select#assignment").empty();
    var assignments = data.assignments;
    console.log("assignments = " + assignments);
    $.each(assignments, function(key, value) {
        var uuid = value;
        assignment_get(update_asn_list_item, uuid);
    });
}

function update_asn_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var assignment = data[uuid];
    $("select#assignment")
        .append($("<option>", { value : uuid})
                .text(assignment.name));
}

function update_tst_list(data, status) {
    $("select#test").empty();
    var tests = data.tests;
    console.log("tests = " + tests);
    $.each(tests, function(key, value) {
        var uuid = value;
        test_get(update_tst_list_item, uuid);
    });
}

function update_tst_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var test = data[uuid];
    $("select#test")
        .append($("<option>", { value : uuid})
                .text(test.name));
}

function save_fle_uuid(data, status) {
    fle_uuid = data.files[0];
}

function save_sub_uuid(data, status) {
    sub_uuid = data.submissions[0];
}

function save_run_uuid(data, status) {
    run_uuid = data.runs[0];
}

function chk_added_files(data, status) {
    console.log("Added files: " + data.files);
}

function update_max_score(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var tst = data[uuid];
    $("span#max_score").text(tst.maxscore);
}

function update_results(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var run = data[uuid];
    $("span#run_status").text(run.status);
    $("span#run_score").text(run.score);
    $("span#run_retcode").text(run.retcode);
    $("pre#run_output").text(run.output);
}

$("select#assignment").change(function() {
    assignment_tests_get(update_tst_list, $("select#assignment").val());
    $("select#test").change();
});

$("select#test").change(function() {
    test_get(update_max_score, $("select#test").val());
});

$("form#submitform").submit(function() {
    
    // Get Input
    var asn_uuid = $("select#assignment").val();
    var tst_uuid = $("select#test").val();

    // Validate Data
    if((!asn_uuid) || (asn_uuid.length != 36)) {
	    console.log("Valid Assignment UUID Required");
	    return false;
    }
    if((!tst_uuid) || (tst_uuid.length != 36)) {
	    console.log("Valid Test UUID Required");
	    return false;
    }
    if($("input#file").val().length == 0) {
	    console.log("Valid File Required");
	    return false;
    }

    // Upload File
    var file_ext = $("select#file").val().split('.').pop();
    console.log("File Extension = " + file_ext);
    var form_data = new FormData($('form#submitform')[0]);
    console.log("Submitting File...");
    file_post(save_fle_uuid, form_data);

    // Create Submission
    console.log("Creating Submission...");
    assignment_submission_create(save_sub_uuid, asn_uuid);

    // Add Files to Submission
    var file_lst = [fle_uuid];
    console.log("Adding Files...");
    submission_add_files(chk_added_files, sub_uuid, file_lst);

    // Launch Test Run
    console.log("Starting Test Run...");
    submission_run_test(save_run_uuid, sub_uuid, tst_uuid);

    // Log to Console
    console.log("asn_uuid = " + asn_uuid);
    console.log("tst_uuid = " + tst_uuid);
    console.log("fle_uuid = " + fle_uuid);
    console.log("sub_uuid = " + sub_uuid);
    console.log("run_uuid = " + run_uuid);

    // Get Results
    run_get(update_results, run_uuid);
    return false
    
});

$("button#logout").click(function() {
    logout();
});
