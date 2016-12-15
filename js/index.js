"use strict";

(function() {
  
  $.getJSON("http://ip-api.com/json", function determineLocation(ipLocation) {
    var zip = ipLocation.zip;
    var country = ipLocation.countryCode;

    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?zip={" + zip + "},{" + country + "}";
    var userKey = "&units=imperial&appid=20573b9a59a767f17aff8a87788ab6b9";
    $.getJSON(weatherURL + userKey, function queryWeather(weatherData) {
      var weatherDescription = weatherData.weather[0].description;
      var temp = weatherData.main.temp.toFixed();

      if (seasonCheck()) {
        afterFiveCheck();
        coldOutsideCheck(temp);
        iceOrSnowCheck(weatherDescription);
        determineAnswer();
      } else {
        $(".answer").html("Sadly, Snow Cap is out of season for " + (10 - month) + " more months.");
      }
    });
  });

  var date = new Date();
  var month = date.getMonth() + 1;
  var hours = date.getHours();

  function seasonCheck() {
    if (month >= 10 || month === 1) { // Snow Cap is in season October through January
      qualifierYes($(".season"));
      return true;
    }
  }

  function afterFiveCheck() {
    if (hours >= 17 || hours < 3) { // Drinking time will be 5pm through 2:59am
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
      qualifiersCount++; // Bonus point given
    }
  }

  function determineAnswer() {
    if (qualifiersCount > 1) {
      $(".answer").html("The answer is yes!");
      $(".appText").addClass("textMoveLeft");
      $(".bottle").css("left", "50%"); // Moves bottle onto screen
      if (qualifiersCount > 2) {
        $(".answer").html("Why hell yes!");
      }
    } else {
      $(".answer").html("Not quite yet.");
      displayScrewItBtn();
    }
  }

  function displayScrewItBtn() {
    $(".answer").append("<br><button class='screwItBtn'>Screw it, beer me!</button>");
    $(".bottle").css("top", "-3em");
    $(".screwItBtn").click(function() {
      $(".snowCapQuestion").hide();
      $(".allQualifiers").hide();
      $(".answer").html("Happy Winter!");
      $(".bottle").css("left", "40%");
    });
  }

  var qualifiersCount = 0;

  function qualifierYes(qualifier) {
    qualifier.css("text-decoration", "none");
    qualifier.css("opacity", 1);
    qualifiersCount++;
  }
  
})();