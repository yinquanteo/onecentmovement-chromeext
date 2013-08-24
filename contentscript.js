var modalBoss = (function() {
  var $donateModal;
  var $modalContents;
  var init = function () {
    initModal();
  };

  var initModal = function () {
    initDOM();
    initJS();
  };

  var initDOM = function () {
    var modalContainer = document.createElement("div");
    modalContainer.className = "onecent-movement";
    var modalString = [
      '<div id="onecent-donate-modal" class="reveal-modal">',
        '<iframe id="onecent-modal-iframe" frameBorder=0 height="225px" width="100%" ></iframe>',
        '<a class="close-reveal-modal" style="text-decoration:none;">&#215;</a>',
      '</div>',
      '<div class="reveal-modal-bg" style="display: none"></div>'
    ].join('\n');
    modalContainer.innerHTML = modalString;
    document.body.appendChild(modalContainer);
  };

  var initJS = function () {
    $donateModal = $('#onecent-donate-modal');
    $modalContents = $('#onecent-donate-modal #onecent-modal-iframe');
    $donateModal.foundation('reveal', {
      bgClass: 'reveal-modal-bg',
      bg : $('.onecent-movement .reveal-modal-bg')
    });
    $(document).foundation();
  };

  // options => {total: invoiceTotal, roundUp: roundUpTotal, success: successCallback}
  var show = function (options) {
    var params = "?total="+ options.total + "&roundUp=" + options.roundUp;
    $modalContents.attr('src', chrome.extension.getURL("donation-modal.html") + params);
    $donateModal.foundation('reveal', 'open');
  };

  return { init: init, show: show };
})();


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
    // NOTE ensure cross browser compatibility of innerText when we move to support other browsers
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
      modalBoss.init();
      setTimeout(function () {
        chrome.runtime.sendMessage({action: "fetchToken"}, function(response) {
          authToken = response["token"];
        });
        modalBoss.show({
          total: twoDecimals(amount),
          roundUp: donationTotal(amount),
          success: function () { donate(donationTotal(amount)) }
        });
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
