var asn_uuid  = null;
var tst_uuid  = null;
var fle_uuids = null;
var sub_uuid  = null;
var run_uuid  = null;

function submit_onload() {
    $("span#current_user").text($.cookie(COOKIE_USER_NAME));    
    assignments_get_submitable(update_asn_list);
    $("select#assignment").change();
}

function update_asn_list(data, status) {
    $("select#assignment").empty();
    var assignments = data.assignments;
    console.log("assignments = " + assignments);
    if(assignments.length > 0) {
        $.each(assignments, function(key, value) {
            var uuid = value;
            assignment_get(update_asn_list_item, uuid);
        });
	$("select#assignment").prop("disabled", false);
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
}

function update_tst_list(data, status) {
    $("select#test").empty();
    var tests = data.tests;
    console.log("tests = " + tests);
    if(assignments.length > 0) {
	$.each(tests, function(key, value) {
            var uuid = value;
            test_get(update_tst_list_item, uuid);
	});
	$("select#test").prop("disabled", false);
	$("input#file").prop("disabled", false);
	$("button#submit").prop("disabled", false);
    }
    else {
        $("select#test")
            .append($("<option>", { value : ""})
                    .text("No Tests Accepting Submissions"));
	$("select#test").prop("disabled", true);
	$("input#file").prop("disabled", true);
	$("button#submit").prop("disabled", true);
    }
}

function update_tst_list_item(data, status) {
    var keys = Object.keys(data);
    var uuid = keys[0];
    var test = data[uuid];
    $("select#test")
        .append($("<option>", { value : uuid})
                .text(test.name));
}

function save_fle_uuids(data, status) {
    fle_uuids = data.files;
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
    var uuid = $("select#assignment").val();
    if(uuid.length > 0) {
        assignment_tests_get(update_tst_list, uuid);
        $("select#test").change();
    }
});

$("select#test").change(function() {
    var uuid = $("select#test").val();
    if(uuid.length > 0) {    
	test_get(update_max_score, uuid);
    }
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
    file_post(save_fle_uuids, form_data);

    // Create Submission
    console.log("Creating Submission...");
    assignment_submission_create(save_sub_uuid, asn_uuid);

    // Add Files to Submission
    var file_lst = fle_uuids;
    console.log("Adding Files...");
    submission_add_files(chk_added_files, sub_uuid, file_lst);

    // Launch Test Run
    console.log("Starting Test Run...");
    submission_run_test(save_run_uuid, sub_uuid, tst_uuid);

    // Log to Console
    console.log("asn_uuid  = " + asn_uuid);
    console.log("tst_uuid  = " + tst_uuid);
    console.log("fle_uuids = " + fle_uuids);
    console.log("sub_uuid  = " + sub_uuid);
    console.log("run_uuid  = " + run_uuid);

    // Get Results
    run_get(update_results, run_uuid);
    return false
    
});

$("button#logout").click(function() {
    logout();
});
