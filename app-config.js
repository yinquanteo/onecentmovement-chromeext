var ONECENT_DEVELOPMENT_MODE = false;
if (ONECENT_DEVELOPMENT_MODE) {
  var ONECENT_CONFIG = {
    popUpDelay: 0,
    donationEndPoint: "http://localhost:3000/round_ups.json"
  };
} else {
  var ONECENT_CONFIG = {
    popUpDelay: 2000,
    donationEndPoint: "http://onecent.heroku.com/round_ups.json"
  };
}
