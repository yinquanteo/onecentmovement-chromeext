var onecent = (function() {
  // dev
  var appConfig = {
    popUpDelay: 0,
    donationEndPoint: "http://localhost:3000/round_ups.json"
  }
  //production
  //var appConfig = {
    //popUpDelay: 2000,
    //donationEndPoint: "http://onecent.heroku.com/round_ups.json"
  //}
  var regex = /(grand total|total|total amount)[:\s]*S?\$?([,\d]+\.\d+)/i;
  var authToken;

  var matchedAmount = function () {
    // TODO ensure cross browser compatibility of innerText
    var m = document.body.innerText.match(regex);
    return (m ? m[2] : null);
  };
  var twoDecimals = function(amount) {
    return parseFloat(amount).toFixed(2);
  };
  var formattedAmount = function(amount) {
    return "$" + twoDecimals(amount);
  };
  var donationTotal = function(amount) {
    return twoDecimals(Math.ceil(amount) - amount);
  };

  var displayDonationDialog = function () {
    var amount = matchedAmount();
    if (amount) {
      setTimeout(function () {
        chrome.runtime.sendMessage({}, function(response) {
          authToken = response["token"];
        });
        var donation = formattedAmount(donationTotal(amount));
        var donateText = "Your invoice amount " + formattedAmount(amount) + "\n"
                       + "Donate " + donation + "?";
        if (confirm(donateText)) {
          donate(donationTotal(amount));
        }
      }, appConfig.popUpDelay);
    }
  };

  var donate = function(amount) {
    $.ajax({
      type: "POST",
      url: appConfig.donationEndPoint,
      data: {
        round_up: {
          amount: (amount * 100)
        },
        auth_token: authToken
      },
      success: function () {
        alert("Donated " + amount);
      }
    });

  };

  return {
    displayDonationDialog: displayDonationDialog
  };
})();

onecent.displayDonationDialog();
