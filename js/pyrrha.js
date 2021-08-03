/**
 * Pyrrha Tizen Web API code.
 *
 * For providing haptic alerts when thresholds are breached and regular readings.
 */

/**
 * Display the clock.
 */
(function () {
  "use strict";

  function setTime() {
    var date = new Date(),
      hours = date.getHours(),
      minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
      ampm = hours >= 12 ? "PM" : "AM",
      time = "";

    hours = hours < 10 ? "0" + hours : hours;
    time = hours + ":" + minutes + ampm;

    document.getElementById("device-clock").innerText = time;

    window.setTimeout(setTime, 1000);
  }
  setTime();
})();

/**
 * Receive readings and provide notifications as needed.
 */
(function () {
  "use strict";

  function sendNotification(message) {
    console.log("sendNotification [" + message + "]");

    if (useToast) {
      createHTML(message);
    } else {
      var notificationGroupDict = {
        content: message,
        images: {
          iconPath: "img/pyrrha-watch-icon.png",
        },
        actions: {
          vibration: true,
        },
      };

      var notification = new tizen.UserNotification(
        "SIMPLE",
        "Limit alert",
        notificationGroupDict
      );

      tizen.notification.post(notification);
    }
  }

  function setSensorValues() {
    console.log("setSensorValues");

    // Get a reference to the UI widgets
    var displayCo = document.getElementById("display-co");
    var displayNo2 = document.getElementById("display-no2");
    var displayTmp = document.getElementById("display-tmp");
    var displayHum = document.getElementById("display-hum");

    // To simulate for local testing, set up some random values to display and log.
    var readingCo = (Math.random() * 150).toFixed(1);
    var readingNo2 = (Math.random() * 10).toFixed(1);
    var readingTmp = (Math.random() * 50).toFixed(1);
    var readingHum = (Math.random() * 100).toFixed(1);
    console.log(readingCo);
    console.log(readingNo2);
    console.log(readingTmp);
    console.log(readingHum);

    // Set the values
    displayCo.innerText = readingCo;
    displayNo2.innerText = readingNo2;
    displayTmp.innerText = readingTmp;
    displayHum.innerText = readingHum;

    // TODO: Get real-time values from Bluetooth
    /*
        	  
        	*/

    // Send notifications if readings are too high
    if (parseInt(displayCo.innerText) >= CO_RED) {
      displayCo.className = "color-red";
      sendNotification("CO high");
    } else {
      displayCo.className = "color-green";
    }

    if (parseInt(displayNo2.innerText) >= NO2_RED) {
      displayNo2.className = "color-red";
      sendNotification("NO2 high");
    } else {
      displayNo2.className = "color-green";
    }

    if (parseInt(displayTmp.innerText) >= TMP_RED) {
      displayTmp.className = "color-red";
      if (notifyTmpHum) sendNotification("Temp high");
    } else {
      displayTmp.className = "color-green";
    }

    if (parseInt(displayHum.innerText) >= HUM_RED) {
      displayHum.className = "color-red";
      if (notifyTmpHum) sendNotification("Hum high");
    } else {
      displayHum.className = "color-green";
    }

    // Refresh values every second
    window.setTimeout(setSensorValues, 3000);
  }

  setSensorValues();
})();
