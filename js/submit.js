function submit_onload() {
    assignments_get(update_asn_list)
}

function update_asn_list(data, status) {
    var assignments = data.assignments
    console.log("assignments = " + assignments)
    $.each(assignments, function(value) {   
        $("select#assignment")
            .append($("<option>", { value : value})
                    .text(value));
    });
}

$("button#logout").click(function() {
    logout()
});
