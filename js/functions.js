// Custom Pyrrha JavaScript

(function () {
	"use strict";

	function setTime() {
		var date = new Date(),
				hours = date.getHours(),
				minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
				ampm = hours >= 12 ? 'PM' : 'AM',
				time = "";

		hours = hours < 10 ? '0' + hours : hours;
		time = hours + ':' + minutes;
		
		// document.getElementById('home-clock').innerText = time;
		document.getElementById('device-clock').innerText = time;
		
		window.setTimeout(setTime, 1000);
	}
	setTime();
}());

(function () {
	"use strict";
	
	function sendNotification(message) {
		var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/create_content', null, 'image/png', null, null);

		var notificationGroupDict = {
		    /* Notification content */
		    content: message,
		    images: {
		        /* Path to the notification icon */
		        iconPath: '../icon.png'
		    },
		    actions: {
		        /* Device vibrates when the notification is displayed */
		        vibration: true,
		        /* Application control to be launched when the user selects the notification */
		        appControl: appControl
		    }
		};
		
		var notification = new tizen.UserNotification('SIMPLE', 'Exposure alert', notificationGroupDict);
		
		tizen.notification.post(notification);
	}
	
	function setSensorValues() {
		var co = [15, 20, 25, 30, 35, 40];
		var no2 = [0.05, 0.10, 0.15, 0.20, 0.25];
		var tmp = [30, 31, 32, 33, 34, 35];
		var hum = [82, 83, 85, 87, 89];
		
		document.getElementById('co').innerText = co[Math.floor(Math.random() * co.length)];
		document.getElementById('no2').innerText = no2[Math.floor(Math.random() * no2.length)];
		document.getElementById('tmp').innerText = tmp[Math.floor(Math.random() * tmp.length)];
		document.getElementById('hum').innerText = hum[Math.floor(Math.random() * hum.length)];
		
		if (document.getElementById('co').innerText == '40') {
			sendNotification('Your carbon monoxide exposure is too great.')
		}
		
		window.setTimeout(setSensorValues, 1000);
	}
	setSensorValues();
}());

(function() {
    window.addEventListener('tizenhwkey', function(ev) {
        if (ev.keyName === 'back') {
            var page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : '';

            if (pageid !== 'main') {
                window.history.back();
            }
        }
    });
}());

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