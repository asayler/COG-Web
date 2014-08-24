$("form#login").submit(function() {
    var username = $("input#username").val();
    var password = $("input#password").val();
    login(username, password);
});
