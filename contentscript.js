var onecent = (function() {
  var regex = /grand total: \$([,\d]+\.\d+)/i;
  var matchedAmount = function () {
    var m = document.body.innerText.match(regex);
    return (m ? m[1] : null);
  };

  var donationTotal = function(amount) {
    return parseFloat(Math.ceil(amount) - amount).toFixed(2);
  };

  var displayDonationDialog = function () {
    var amount = matchedAmount();
    if (amount) {
      chrome.extension.sendRequest({}, function(response) {});
      var donation = donationTotal(amount);
      var donateText = "Donate $" + donation + "?";
      if (confirm(donateText)) {
        alert("You pressed OK!")
      }
    }
  };

  return {
    displayDonationDialog: displayDonationDialog
  };
})();

onecent.displayDonationDialog();
