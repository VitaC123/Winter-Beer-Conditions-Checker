"use strict";

(function() {
  $(".questionBtn").click(function() {
    $(".introText").slideUp();
    $(this).hide();
    $(".checkingWinterBeerConditions").fadeIn(1200);
    determineLocationWeatherAndRunChecks();
  });

  function determineLocationWeatherAndRunChecks() {
    $.getJSON("http://ip-api.com/json", function determineUserLocationForWeather(ipLocation) {
      var zip = ipLocation.zip;
      var country = ipLocation.countryCode;
      var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?zip={" + zip + "},{" + country + "}";
      var userKey = "&units=imperial&appid=20573b9a59a767f17aff8a87788ab6b9";
      $.getJSON(weatherAPI + userKey, function queryLocalWeather(weatherData) {
        var weatherDescription = weatherData.weather[0].description;
        var temperature = weatherData.main.temp.toFixed();
        runEachCheckSequentially(temperature, weatherDescription);
      });
    });
  }

  function runEachCheckSequentially(temperature, weatherDescription) {
    seasonCheck(function() {
      afterFiveCheck(function() {
        coldOutsideCheck(temperature, function() {
          snowBonusCheck(weatherDescription, function() {
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
      $(".bottle").show().animate({"left": "0%"}, "slow");
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
    $(".screwItBtn").click(function() {
      $(".answer").html("Happy Winter!");
      $(".bottle").css("width", "100%");
      $(".bottle").show().animate({"left": "0%"}, "slow");
      $(".allQualifiers").hide();
      $(".screwItBtn").hide();
    });
  }

  function styleQualifier(qualifier, conditionMet, callback) {
    $("." + qualifier).prepend('<i class="' + qualifier + 'Fa fa fa-snowflake-o fa-spin" aria-hidden="true"></i> ');
    $("." + qualifier).show();
    setTimeout(function() {
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