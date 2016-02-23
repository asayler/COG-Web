function show_history() {
    // Get previous submissions
    console.log("Get previous submissions...");
    history_get(display_history, submit_error_callback);
}

function display_history(data, status) {
    // Update History
    $("span#past_submissions").text(JSON.stringify(data));
}

function submit_error_callback(xhr, status, error) {
    // Log Error
    console.log("Status: " + status, ", Error: " + error);
}