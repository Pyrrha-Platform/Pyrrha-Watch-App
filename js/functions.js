// Custom Prometeo JavaScript

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
		
		document.getElementById('home-clock').innerText = time;
		document.getElementById('device-clock').innerText = time;
		
		window.setTimeout(setTime, 1000);
	}
	setTime();
}());

(function () {
	"use strict";
	
	function setSensorValues() {
		var co = [15, 20, 25];
		var no2 = [0.05, 0.15, 0.15];
		var tmp = [30, 31, 32];
		var hum = [82, 85, 87];
		
		document.getElementById('co').innerText = co[Math.floor(Math.random() * co.length)] + 'ppm';
		document.getElementById('no2').innerText = no2[Math.floor(Math.random() * no2.length)] + 'ppm';
		document.getElementById('tmp').innerHTML = tmp[Math.floor(Math.random() * tmp.length)] + '&#8451;';
		document.getElementById('hum').innerText = hum[Math.floor(Math.random() * hum.length)] + '%';
		
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