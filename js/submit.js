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

function get_file_uuid(data, status) {
    file_uuid = data.files[0]
}

$("form#submit").submit(function() {
    
    var asn_uuid = $("select#assignment").val();
    var file_uuid = null;
    var sub_uuid = null;
    var run_uuid = null;

    // Upload File
    var form_data = new FormData($('form#submit')[0]);
    console.log("Submitting...")
    file_post(get_file_uuid, form_data);

    // Log to Console
    consoel.log("asn_uuid = " + asn_uuid)
    consoel.log("file_uuid = " + file_uuid)
    consoel.log("sub_uuid = " + sub_uuid)
    consoel.log("run_uuid = " + run_uuid)
    
});

$("button#logout").click(function() {
    logout();
});
