/**
 * Pyrrha Tizen Web API code.
 *
 * For providing haptic alerts when thresholds are breached.
 */

// Should be consistent with 
// https://github.com/Pyrrha-Platform/Pyrrha-Dashboard/blob/main/pyrrha-dashboard/src/utils/Constants.js
const TMP_RED = 32;
const HUM_RED = 80;
const CO_RED = 420;
const NO2_RED = 8;

/**
 * Display the clock.
 */
(function() {
    "use strict";

    function setTime() {
        var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
            ampm = hours >= 12 ? 'PM' : 'AM',
            time = "";

        hours = hours < 10 ? '0' + hours : hours;
        time = hours + ':' + minutes;

        document.getElementById('device-clock').innerText = time;

        window.setTimeout(setTime, 1000);
    }
    setTime();
}());

/**
 * Receive readings and provide notifications as needed.
 */
(function() {
    "use strict";

    function sendNotification(message) {

        var notificationGroupDict = {
            content: message,
            images: {
                iconPath: 'img/pyrrha-watch-icon.png'
            },
            actions: {
                vibration: true,
            }
        };

        var notification = new tizen.UserNotification('SIMPLE', 'Limit alert', notificationGroupDict);

        tizen.notification.post(notification);
    }

    function setSensorValues() {

        var readingCo = document.getElementById('reading-co');
        var readingNo2 = document.getElementById('reading-no2');
        var readingTmp = document.getElementById('reading-tmp');
        var readingHum = document.getElementById('reading-hum');

        // To simulate for local testing, set up some random values to display.
        readingCo.innerText = (Math.random() * 150).toFixed(1);
        readingNo2.innerText = (Math.random() * 10).toFixed(1);
        readingTmp.innerText = (Math.random() * 50).toFixed(1);
        readingHum.innerText = (Math.random() * 100).toFixed(1);

        // TODO: Get real-time values from Bluetooth

        // Send notifications if readings are too high
        if (parseInt(readingCo.innerText) >= CO_RED) {
            readingCo.className = 'color-red';
            sendNotification('CO too high.');
        } else {
            readingCo.className = 'color-green';
        }

        if (parseInt(readingNo2.innerText) >= NO2_RED) {
            readingNo2.className = 'color-red';
            sendNotification('NO2 too high.');
        } else {
        		readingNo2.className = 'color-green';
        }

        if (parseInt(readingTmp.innerText) >= TMP_RED) {
            readingTmp.className = 'color-red';
            sendNotification('Tmp too high.');
        } else {
        		readingTmp.className = 'color-green';
        }

        if (parseInt(readingHum.innerText) >= HUM_RED) {
            readingHum.className = 'color-red';
            sendNotification('Hum too high.');
        } else {
        		readingHum.className = 'color-green';
        }

        // Refresh values every second
        window.setTimeout(setSensorValues, 1000);
    }

    setSensorValues();
}());

/**
 * Manage the screens.
 */
(function() {
    window.addEventListener('tizenhwkey', function(ev) {
        if (ev.keyName === 'back') {
            var page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : '';

            if (pageid === 'main') {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                window.history.back();
            }
        }
    });
}());

/**
 * Keep the app from going to sleep.
 */
(function() {
    try {
        tizen.power.setScreenStateChangeListener(function(prevState, currState) {
            if (currState === 'SCREEN_NORMAL' && prevState === 'SCREEN_OFF') {
                // On screen wake
                var app = tizen.application.getCurrentApplication();
                tizen.application.launch(app.appInfo.id, function() {
                    // You can do something here when your app has launched
                });
            }
        });
    } catch (e) {}
}());