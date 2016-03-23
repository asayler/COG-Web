var sub_uuid = null;

// Get retcode, score and status
function show_files() {
	sub_uuid = getParameterByName('uuid');

	$("span#sub_uuid").text(sub_uuid);

	submission_get_files(find_files, submit_error_callback, sub_uuid);

	function find_files(data, status) {
		var array_length = data.files.length;
		var file_array = [];

		$.each(data.files, function(index, uuid) {
			file_get(append_files, submit_error_callback, uuid);

			function append_files(data, status) {
				var f = {};

				var uuid = Object.keys(data)[0];

				var file_name = data[uuid].name;

				f.name = file_name;
				f.uuid = uuid;

				file_array.push(f);

				// Account for length of the array
				if(file_array.length == array_length) {
					$.each(file_array, function(index, fle) {
						var url = window.location.href;
						var fle_uri = encodeURI("&file=" + fle.uuid);
						url += fle_uri;

						console.log(url);
						// var url_uuid = encodeURI("?uuid=" + fle.uuid);
						// var url = "../download.html";
						// url += url_uuid;
						// console.log(url);
						// $("#files_table").append("<tr><td>" + fle.name + '</td><td><a href="' + url + '" download="">' + fle.uuid + "<a></td></tr>");
						// console.log(JSON.stringify(fle));
					});
				}
			}
		});
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