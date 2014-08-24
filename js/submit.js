var asn_uuid = null;
var tst_uuid = null;
var fle_uuid = null;
var sub_uuid = null;
var run_uuid = null;

function submit_onload() {
    assignments_get(update_asn_list);
    $("select#assignment").change();
}

function update_asn_list(data, status) {
    $("select#assignment").empty()
    var assignments = data.assignments;
    console.log("assignments = " + assignments);
    $.each(assignments, function(key, value) {
        var uuid = value;
        assignment_get(update_asn_list_item, uuid);
    });
}

function update_asn_list_item(data, status) {
    keys = Object.keys(data);
    uuid = keys[0];
    var assignment = data[uuid]
    $("select#assignment")
        .append($("<option>", { value : uuid})
                .text(assignment.name));
}

function update_tst_list(data, status) {
    $("select#test").empty()
    var tests = data.tests;
    console.log("tests = " + tests);
    $.each(tests, function(key, value) {
        var uuid = value;
        test_get(update_tst_list_item, uuid);
    });
}

function update_tst_list_item(data, status) {
    keys = Object.keys(data);
    uuid = keys[0];
    var test = data[uuid]
    $("select#test")
        .append($("<option>", { value : uuid})
                .text(test.name));
}

function save_file_uuid(data, status) {
    fle_uuid = data.files[0];
}

$("select#assignment").change(function() {
    assignment_tests_get(update_tst_list, $("select#assignment").val());
});

$("form#submit").submit(function() {
    
    // Get Input
    asn_uuid = $("select#assignment").val();
    tst_uuid = $("select#test").val();

    // Validate Data
    if((!asn_uuid) || (asn_uuid.length != 36)) {
	$("output#asn_error").text("Assignment Required");
	return false
    }
    if((!tst_uuid) || (tst_uuid.length != 36)) {
	$("output#tst_error").text("Test Required");
	return false
    }
    if($("input#file").val().length == 0) {
	$("output#fle_error").text("File Required");
	return false
    }

    // Upload File
    var form_data = new FormData($('form#submit')[0]);
    console.log("Submitting File...")
    file_post(save_file_uuid, form_data);
    console.log("File Submitted...")

    // Create Submission
    var form_data = new FormData($('form#submit')[0]);
    console.log("Submitting File...")
    file_post(save_file_uuid, form_data);
    console.log("File Submitted...")

    // Log to Console
    console.log("asn_uuid = " + asn_uuid);
    console.log("tst_uuid = " + tst_uuid);
    console.log("fle_uuid = " + fle_uuid);
    console.log("sub_uuid = " + sub_uuid);
    console.log("run_uuid = " + run_uuid);
    
});

$("button#logout").click(function() {
    logout();
});
