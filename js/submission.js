// Get retcode, score and status
function show_files() {
    var sub_uuid = getParameterByName('uuid');
    $("span#sub_uuid").text(sub_uuid);

    var find_files = function(data, status) {
        var array_length = data.files.length;
        var file_array = [];

        $.each(data.files, function(index, uuid) {
            file_get(function(data, status) {
                var f = {};

                var uuid = Object.keys(data)[0];
                var file_name = data[uuid].name;

                f.name = file_name;
                f.uuid = uuid;

                file_array.push(f);

                // Account for length of the array
                if (file_array.length === array_length) {
                    sort_files(file_array);
                }
            }, submit_error_callback, uuid);
        });
    };

    submission_get_files(find_files, submit_error_callback, sub_uuid);
}

function sort_files(file_array) {
    file_array.sort(function(x, y) {
        return x.name.localeCompare(y.name);
    });

    $.each(file_array, function(index, fle) {
        var url = file_get_uri(fle.uuid);
        $("#files_table").append("<tr><td>" + fle.name + '</td><td><a href="' + url + '">' + fle.uuid + "<a></td></tr>");
    });

    console.log("Sorted Table");
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
