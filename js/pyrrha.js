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
        var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/create_content', null, 'image/png', null, null);

        var notificationGroupDict = {
            content: message,
            images: {
                iconPath: '../icon.png'
            },
            actions: {
                vibration: true,
                /* Application control to be launched when the user selects the notification */
                appControl: appControl
            }
        };

        var notification = new tizen.UserNotification('SIMPLE', 'Limit alert', notificationGroupDict);

        tizen.notification.post(notification);
    }

    function setSensorValues() {
    	
    		// To simulate for local testing, set up some random values to display.
    		/*
        var co = [150, 200, 250, 300, 350, 400, 500];
        var no2 = [0.05, 0.10, 0.15, 0.20, 0.25];
        var tmp = [30, 31, 32, 33, 34, 35];
        var hum = [82, 83, 85, 87, 89];
        document.getElementById('co').innerText = co[Math.floor(Math.random() * co.length)];
        document.getElementById('no2').innerText = no2[Math.floor(Math.random() * no2.length)];
        document.getElementById('tmp').innerText = tmp[Math.floor(Math.random() * tmp.length)];
        document.getElementById('hum').innerText = hum[Math.floor(Math.random() * hum.length)];
        
        document.getElementById('co').innerText = (Math.random() * 150).toFixed(2);
        document.getElementById('no2').innerText = (Math.random() * 10).toFixed(2);
        document.getElementById('tmp').innerText = (Math.random() * 50).toFixed(2);
        document.getElementById('hum').innerText = (Math.random() * 100).toFixed(2);
        	*/
        
        document.getElementById('co').innerText = (Math.random() * 150).toFixed(2);
        document.getElementById('no2').innerText = (Math.random() * 10).toFixed(2);
        document.getElementById('tmp').innerText = (Math.random() * 50).toFixed(2);
        document.getElementById('hum').innerText = (Math.random() * 100).toFixed(2);
        
        	// TODO: Get real-time values from Bluetooth

        	// Send notifications if readings are too high
        if (parseInt(document.getElementById('co').innerText) >= CO_RED) {
            sendNotification('CO too high.')
        }
       
        if (parseInt(document.getElementById('no2').innerText) >= NO2_RED) {
            sendNotification('NO2 too high.')
        }

        if (parseInt(document.getElementById('tmp').innerText) >= TMP_RED) {
            sendNotification('Tmp too high.')
        }

        if (parseInt(document.getElementById('hum').innerText) >= HUM_RED) {
            sendNotification('Hum too high.')
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