function initiate_download() {
	file_uuid = getParameterByName('uuid');

    file_get(get_contents, submit_error_callback, file_uuid);

    function get_contents(data, status) {
        var filename = data[file_uuid].name;
        $("span#file_name").text(filename);
        file_get_contents(log_download, submit_error_callback, file_uuid);

        function log_download(data, status) {
            console.log("downloading:" + JSON.stringify(data));
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