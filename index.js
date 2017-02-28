(function () {
  "use strict";

  $(".questionBtn").click(function () {
    $(".introText").slideUp();
    $(this).hide();
    $(".checkingWinterBeerConditions").fadeIn(1200);
    determineLocation();
  });

  function determineLocation() {
    $.getJSON("http://ip-api.com/json")
      .done(function (ipLocation) {
        determineWeather(ipLocation.zip, ipLocation.countryCode);
      })
      .fail(function () {
        console.log("Unable to determine location. Continuing program for demonstration purposes.");
        determineWeather(97206, "US");
      });
  }

  function determineWeather(zip, country) {
    var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?zip={" + zip + "},{" + country + "}";
    var userKey = "&units=imperial&appid=0f3a5dd0d9770b5bd04f4b7b47819d10";
    $.getJSON(weatherAPI + userKey)
      .done(function queryLocalWeather(weatherData) {
        runEachCheckSequentially(weatherData.main.temp.toFixed(), weatherData.weather[0].description);
      })
      .fail(function () {
        console.log("Unable to determine weather. Continuing program for demonstration purposes.");
        runEachCheckSequentially(50, "");
      });
  }

  function runEachCheckSequentially(temperature, weatherDescription) {
    seasonCheck(function () {
      afterFiveCheck(function () {
        coldOutsideCheck(temperature, function () {
          snowBonusCheck(weatherDescription, function () {
            determineAnswer();
          });
        });
      });
    });
  }

  var qualifiersCount = 0;
  var date = new Date();

  function seasonCheck(callback) {
    var month = date.getMonth() + 1;
    var conditionMet = month >= 10 || month === 1;
    if (!conditionMet) {
      qualifiersCount -= 1; // Ensures beer is in season for a "yes" answer
    }
    styleQualifier("season", conditionMet, callback);
  }

  function afterFiveCheck(callback) {
    var hours = date.getHours();
    var conditionMet = hours >= 17 || hours < 3;
    styleQualifier("afterFive", conditionMet, callback);
  }

  function coldOutsideCheck(temperature, callback) {
    var conditionMet = temperature <= 40;
    styleQualifier("coldOutside", conditionMet, callback);
  }

  function snowBonusCheck(weatherDescription, callback) {
    var conditionMet = weatherDescription.indexOf("snow") > -1;
    styleQualifier("snowBonus", conditionMet, callback);
  }

  function determineAnswer() {
    $(".checkingWinterBeerConditions").hide();
    if (qualifiersCount >= 3) {
      $(".answer").html("The answer is yes!");
      $(".afterIntroText").css("width", "60%");
      $(".bottle").show().animate({ "left": "0%" }, "slow");
      if (qualifiersCount === 4) {
        $(".answer").html("Why hell yes.<br>In fact, drink two!");
      }
    } else {
      $(".answer").html("Not quite yet.");
      displayScrewItBtn();
    }
  }

  function displayScrewItBtn() {
    $(".screwItBtn").show();
    $(".screwItBtn").click(function () {
      $(".answer").html("Happy Winter!");
      $(".bottle").css("width", "100%");
      $(".bottle").show().animate({ "left": "0%" }, "slow");
      $(".allQualifiers").hide();
      $(".screwItBtn").hide();
    });
  }

  function styleQualifier(qualifier, conditionMet, callback) {
    $("." + qualifier).prepend('<i class="' + qualifier + 'Fa fa fa-snowflake-o fa-spin" aria-hidden="true"></i> ');
    $("." + qualifier).show();
    setTimeout(function () {
      $("." + qualifier + "Fa").removeClass("fa-snowflake-o fa-spin");
      if (conditionMet) {
        $("." + qualifier + "Fa").addClass("fa-check-square-o").hide().fadeIn();
        qualifiersCount++;
      } else {
        $("." + qualifier + "Fa").addClass("fa-square-o").hide().fadeIn();
        $("." + qualifier).css("opacity", "0.4");
      }
      callback();
    }, 1500);
  }
})();