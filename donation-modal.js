var Engine = (function () {
  // function to extract url query param
  var query_string = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
        // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
    return query_string;
  }();

  var donate = function(query) {
    // TODO change to production URL
    // TODO ensure that auth token is present (i.e. check for it)
    $("#loading-message").show();
    $("#main-text").hide();
    $.ajax({
      type: "POST",
      url: ONECENT_CONFIG.donationEndPoint,
      data: {
        round_up: {
          amount: (query.roundUp * 100),
          transaction_amount: (query.total * 100),
          url: decodeURIComponent(query.purchaseURL)
        },
        auth_token: localStorage["token"]
      },
      success: function () {
        $("#loading-message").hide();
        $("#success-message").show();
      },
      error: function () {
        $("#loading-message").hide();
        $("#error-message").show();
      }
    });
  };
  return {
    query: query_string,
    donate: donate
  }
})();

$(function() {
  // set total and round up amounts
  $('.total-amount').html("$" + Engine.query.total);
  $('.roundup-amount').html("$" + Engine.query.roundUp);
  $('#confirm-donation').click(function() {
    Engine.donate(Engine.query);
  });
});
