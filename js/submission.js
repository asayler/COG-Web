// Get retcode, score and status
function show_files() {
	var sub_uuid = getParameterByName('uuid');
	var downloadable = getParameterByName('file');

	if (downloadable) {
		initiate_download(downloadable);
	}	

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
					sort_files(file_array);
				}
			}
		});
	}
}

function sort_files(file_array) {
    file_array.sort(function(x, y) {
    	return x.name.localeCompare(y.name);
	});

	$.each(file_array, function(index, fle) {
		var url_arr = window.location.href.split("&");
		var fle_uri = encodeURI("&file=" + fle.uuid);
		var url = url_arr[0] + fle_uri;

		$("#files_table").append("<tr><td>" + fle.name + '</td><td><a href="' + url + '">' + fle.uuid + "<a></td></tr>");
	});

	console.log("Sorted Table");
}

function initiate_download(file_uuid) {
    file_get(get_contents, submit_error_callback, file_uuid);

    function get_contents(data, status) {
        var filename = data[file_uuid].name;
        file_get_contents(log_download, submit_error_callback, file_uuid);

        function log_download(data, status) {
            console.log("Downloading " + filename);
            download(filename, data);
        }
    }
}

// Taken from http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    console.log("Download done");
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