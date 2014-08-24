var asn_uuid = null;
var tst_uuid = null;
var fle_uuid = null;
var sub_uuid = null;
var run_uuid = null;

function submit_onload() {
    assignments_get(update_asn_list);
}

function update_asn_list(data, status) {
    var assignments = data.assignments;
    console.log("assignments = " + assignments);
    $.each(assignments, function(key, value) {
        var uuid = value;
        assignment_get(update_asn_list_item, uuid);
    });
}

function update_asn_list_item(data, status) {
    console.log("data = " + data);
    keys = Object.keys(data);
    console.log("keys = " + keys);
    uuid = keys[0];
    console.log("uuid = " + uuid);
    var assignment = data[uuid]
    $("select#assignment")
        .append($("<option>", { value : uuid})
                .text(assignment.name));
}

function update_tst_list(data, status) {
    var tests = data.tests;
    console.log("tests = " + tests);
    $.each(tests, function(key, value) {
        var uuid = value;
        test_get(update_tst_list_item, uuid);
    });
}

function update_tst_list_item(data, status) {
    console.log("data = " + data);
    keys = Object.keys(data);
    console.log("keys = " + keys);
    uuid = keys[0];
    console.log("uuid = " + uuid);
    var test = data[uuid]
    $("select#test")
        .append($("<option>", { value : uuid})
                .text(test.name));
}

function save_file_uuid(data, status) {
    fle_uuid = data.files[0];
}

$("select#assignment").change(function() {
    assigment_tests_get(update_tst_list, $("select#assignment").val());
});

$("form#submit").submit(function() {
    
    asn_uuid = $("select#assignment").val();
    tst_uuid = $("select#test").val();

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
    console.log("fle_uuid = " + file_uuid);
    console.log("sub_uuid = " + sub_uuid);
    console.log("run_uuid = " + run_uuid);
    
});

$("button#logout").click(function() {
    logout();
});
