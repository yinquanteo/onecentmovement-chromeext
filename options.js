// JavaScript handlers for signing in & registering.
// Used in donation-modal & options page

$(function() {
  $("#register-link").attr('href', ONECENT_CONFIG.signUpLink);

  var signIn = function (email, token) {
    $("#signin").hide();
    $("#signin-error").hide();
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
      url: ONECENT_CONFIG.authTokenEndPoint + ".json",
      type: 'POST',
      data: {
        email:    $("#email").val(),
        password: $("#password").val(),
      },
      success: function(data) {
        signIn(data["email"], data["token"]);
      },
      error: function(data) {
        $("#signin-error").show();
      }
    });
    return false;
  });

  $("#sign-out-button").click(function() { signOut(); });

  // init. show signed in pane if valid token already stored
  if (localStorage["token"]) {
    $.ajax({
      url: ONECENT_CONFIG.authTokenEndPoint + "/" + localStorage["token"] + '.json',
      type: 'GET',
      success: function(data) {
        signIn(data["email"], data["token"]);
      },
      error: function(data) {
        localStorage.removeItem("token");
      }
    });
  }
});
