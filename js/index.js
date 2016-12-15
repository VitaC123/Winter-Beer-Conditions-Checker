"use strict";

(function() {
  var qualifiersCount = 0; // Two or more qualifiers must pass for a "yes" answer

  function qualifierYes(qualifier) {
    qualifier.css("text-decoration", "none");
    qualifier.css("opacity", 1);
    qualifiersCount++;
  }

  var date = new Date();
  var month = date.getMonth() + 1;
  var hours = date.getHours();

  // Snow Cap is in season October through January
  function seasonCheck() {
    if (month >= 10 || month === 1) {
      qualifierYes($(".season"));
    }
  }

  // Drinking time will be 5pm through 2:59am
  function afterFiveCheck() {
    if (hours >= 17 || hours < 3) {
      qualifierYes($(".afterFive"));
    }
  }

  function coldOutsideCheck(temp) {
    if (temp <= 40) {
      qualifierYes($(".coldOutside"));
    }
  }

  function iceOrSnowCheck(weatherDescription) {
    var ice = weatherDescription.indexOf("ice");
    var snow = weatherDescription.indexOf("snow");
    if (ice > -1 || snow > -1) {
      qualifierYes($(".iceOrSnow"));
      qualifiersCount++; // Additional point given
    }
  }

  function determineAnswer() {
    if (qualifiersCount === 2) {
      $(".answer").html("The answer is yes!");
      $(".bottle").css("top", "-3em"); // Moves bottle onto screen
    } else if (qualifiersCount > 2) {
      $(".answer").html("Why hell yes. In fact, drink two!");
      $(".bottle").css("top", "-3em");
    } else {
      $(".answer").html("Not quite yet.");
      displayScrewItBtn();
    }
  }

  function displayScrewItBtn() {
    $(".answer").append("<br><button class='screwItBtn'>Screw it, beer me!</button");
    $(".screwItBtn").click(function() {
      $(".snowCapQuestion").hide();
      $(".allQualifiers").hide();
      $(".answer").html("Happy Winter!");
      $(".bottle").css("top", "-1em");
    });
  }

  // Weather determined by user's IP
  $.getJSON("http://ip-api.com/json", function(ipLocation) {
    var zip = ipLocation.zip;
    var country = ipLocation.countryCode;
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?zip={" + zip + "},{" + country + "}";
    var userKey = "&units=imperial&appid=20573b9a59a767f17aff8a87788ab6b9";
    $.getJSON(weatherURL + userKey, function(weatherData) {
      var weatherDescription = weatherData.weather[0].description;
      var temp = weatherData.main.temp.toFixed();

      seasonCheck();
      afterFiveCheck();
      coldOutsideCheck(temp);
      iceOrSnowCheck(weatherDescription);
      determineAnswer();
    });
  });
})();