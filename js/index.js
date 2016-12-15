"use strict";

(function() {
  $(".questionBtn").click(function() {
    $(".introText").slideUp();
    $(this).html('Checking beer conditions').blur();
    checkBeerConditions();
  });

  function checkBeerConditions() {
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

  var date = new Date();
  function seasonCheck(callback) {
    var month = date.getMonth() + 1;
    var conditionMet = month >= 10 || month === 1; // Snow Cap is in season October through January
    styleQualifier("season", conditionMet, callback);
  }

  function afterFiveCheck(callback) {
    var hours = date.getHours();
    var conditionMet = hours >= 17 || hours < 3; // Drinking time will be 5pm through 2:59am
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
    $(".questionBtn").hide();
    if (qualifiersCount === 3) {
      $(".answer").html("The answer is yes!");
      $(".appText").addClass("textMoveLeft");
      $(".bottle").css("left", "50%"); // Moves bottle onto screen
      if (qualifiersCount > 3) {
        $(".answer").html("Why hell yes.<br>In fact, drink two!");
      }
    } else {
      $(".answer").html("Not quite yet.");
      displayScrewItBtn();
    }
  }

  function displayScrewItBtn() {
    $(".answer").append("<br><button class='screwItBtn'>Screw it, beer me!</button>");
    $(".bottle").css("top", "6em");
    $(".screwItBtn").click(function() {
      $(".answer").html("Happy Winter!");
      $(".allQualifiers").hide();
      $(".bottle").css("left", "40%");
    });
  }

  var qualifiersCount = 0;

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