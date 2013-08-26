var ONECENT_DEVELOPMENT_MODE = false;
if (ONECENT_DEVELOPMENT_MODE) {
  var ONECENT_CONFIG = {
    popUpDelay: 0,
    donationEndPoint: "http://localhost:3000/round_ups.json",
    authTokenEndPoint: "http://localhost:3000/tokens.json"
  };
} else {
  var ONECENT_CONFIG = {
    popUpDelay: 2000,
    donationEndPoint: "http://onecent.heroku.com/round_ups.json",
    authTokenEndPoint: "http://onecent.heroku.com/tokens.json"
  };
}