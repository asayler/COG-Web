var sub_uuid = null;

// Get retcode, score and status
function show_run_info() {
	uuid = getParameterByName('uuid');

	$("span#run_uuid").text(uuid);

	run_get(append_run_info, submit_error_callback, uuid);

	function append_run_info(data, status) {
		var uuid = Object.keys(data)[0];
		var color;

		console.log(JSON.stringify(data));

		$("span#run_score").text(data[uuid].score);
		$("span#run_retcode").text(data[uuid].retcode);
		$("span#run_status").text(data[uuid].status);
		$("pre#run_output").text(data[uuid].output);
		$("pre#max_score").text(data[uuid].maxscore);

	    // Define colors for each type of status
	    var colors = {
	        text: {
	            "success" : "text-success",
	            "warning": "text-warning",
	            "exception": "text-danger",
	            "error": "text-danger"
	        }
	    };

	    // Drop text classes before another is applied
	    $("span#run_status").removeClass(function(index, css) {
	        return (css.match (/(^|\s)text-\S+/g) || []).join(' ');
	    });

	    // Apply relevant background color to status
	    var sub = data[uuid].status.split('-');
	    if (sub.length > 1) {
	        var type = sub[1];
	        console.log('Received completion error: ' + type);

	        $("span#run_status").addClass(colors.text[type]);
	    } else {
	        $("span#run_status").addClass(colors.text["success"]);
	    }
	}
}

// Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function submit_error_callback(xhr, status, error) {
    // Log Error
    console.log("Status: " + status, ", Error: " + error);
}