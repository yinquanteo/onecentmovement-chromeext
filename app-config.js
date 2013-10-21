var ONECENT_DEVELOPMENT_MODE = false;
if (ONECENT_DEVELOPMENT_MODE) {
  var ONECENT_CONFIG = {
    popUpDelay: 0,
    donationEndPoint: "http://localhost:3000/round_ups.json",
    authTokenEndPoint: "http://localhost:3000/tokens",
    signUpLink: "http://localhost:3000/register"
  };
} else {
  var ONECENT_CONFIG = {
    popUpDelay: 2000,
    donationEndPoint: "http://www.onecentmovement.org/round_ups.json",
    authTokenEndPoint: "http://www.onecentmovement.org/tokens",
    signUpLink: "http://www.onecentmovement.org/register"
  };
}
