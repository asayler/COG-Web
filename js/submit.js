function submit_onload() {
    assignments_get(update_asn_list)
}

function update_asn_list(data, status) {
    console.log(data.assignments)
}

$("button#logout").click(function() {
    logout()
});
