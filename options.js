$(function() {
  var signIn = function (email, token) {
    $("#signin").hide();
    $("#signout").show();
    $("#signed-in-email").html(email);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
  };

  var signOut = function () {
    $("#signin").show();
    $("#signout").hide();
    $("#signed-in-email").html("");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    // TODO destroy token on server
  };

  $("#signin").submit(function() {
    $.ajax({
      //TODO CHANGE URL
      url: 'http://localhost:3000/tokens.json',
      type: 'POST',
      data: {
        email:    $("#email").val(),
        password: $("#password").val(),
      },
      success: function(data) {
        signIn(data["email"], data["token"]);
      }
    });
    return false;
  });

  $("#sign-out-button").click(function() { signOut(); });

  // init. show signed in pane if valid token already stored
  if (localStorage["token"]) {
    $.ajax({
      //TODO CHANGE URL
      url: 'http://localhost:3000/tokens/' + localStorage["token"] + '.json',
      type: 'GET',
      success: function(data) {
        signIn(data["email"], data["token"]);
      }
    });
  }
});
