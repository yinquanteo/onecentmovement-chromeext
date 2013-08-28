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
        '<iframe id="onecent-modal-iframe" frameBorder=0 height="370px" width="100%" style="overflow:hidden;"></iframe>',
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

  // options => {total: invoiceTotal, roundUp: roundUpTotal}
  var show = function (options) {
    var params = buildParams(options);
    $modalContents.attr('src', chrome.extension.getURL("donation-modal.html") + params);
    $donateModal.foundation('reveal', 'open');
  };

  var buildParams = function (options) {
    var params = [];
    for (var k in options) {
      params.push("" + k + "=" + encodeURIComponent(options[k]));
    }
    return "?" + params.join("&");
  };

  return { init: init, show: show };
})();


var onecent = (function() {
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
    var roundup = Math.ceil(amount) - amount;
    if (Math.ceil(amount) == amount) {
      roundup += 1;
    }
    return twoDecimals(roundup);
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
          purchaseURL: window.location.href
        });
      }, ONECENT_CONFIG.popUpDelay);
    }
  };

  return {
    displayDonationDialog: displayDonationDialog
  };
})();

onecent.displayDonationDialog();
