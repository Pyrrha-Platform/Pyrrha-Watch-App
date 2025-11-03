/**
 * Pyrrha Tizen Web API code.
 *
 * For providing haptic alerts when thresholds are breached and regular readings.
 * Updated for Galaxy Watch 3 with modern JavaScript (ES6+) and improved error handling.
 */

/**
 * Display the clock with modern JavaScript.
 */
(() => {
  "use strict";

  const setTime = () => {
    try {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = date.getHours() >= 12 ? "PM" : "AM";
      const time = `${hours}:${minutes}${ampm}`;

      const clockElement = document.getElementById("device-clock");
      if (clockElement) {
        clockElement.textContent = time;
      }

      setTimeout(setTime, 1000);
    } catch (error) {
      console.error('Error updating clock:', error);
      setTimeout(setTime, 5000); // Retry after 5 seconds on error
    }
  };

  // Initialize clock when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setTime);
  } else {
    setTime();
  }
})();

/**
 * Sensor readings and notification system with modern JavaScript.
 */
(() => {
  "use strict";

  // State management
  let isConnectedToMobile = false;
  let lastNotificationTime = {};
  const NOTIFICATION_COOLDOWN = 30000; // 30 seconds between same type notifications

  /**
   * Send notification with haptic feedback and rate limiting.
   */
  const sendNotification = async (message, type = 'warning') => {
    try {
      console.log(`sendNotification [${message}] type [${type}]`);

      // Rate limiting to prevent notification spam
      const now = Date.now();
      if (lastNotificationTime[type] && (now - lastNotificationTime[type] < NOTIFICATION_COOLDOWN)) {
        console.log(`Notification ${type} rate limited`);
        return;
      }
      lastNotificationTime[type] = now;

      // Enhanced haptic feedback for Galaxy Watch 3
      if (typeof tizen !== 'undefined' && tizen.feedback) {
        tizen.feedback.play('VIBRATION_WARNING');
      }

      if (useToast) {
        createHTML(message);
      } else {
        const notificationDict = {
          content: message,
          images: {
            iconPath: "pyrrha-watch-icon.png",
          },
          actions: {
            vibration: true,
          },
          vibration: true
        };

        const notification = new tizen.UserNotification(
          "SIMPLE",
          "Pyrrha Safety Alert",
          notificationDict
        );

        tizen.notification.post(notification);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  /**
   * Update sensor display with proper error handling and validation.
   */
  const updateSensorDisplay = (element, value, threshold, sensor, unit = '') => {
    try {
      if (!element) {
        console.warn(`Element not found for sensor ${sensor}`);
        return false;
      }

      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        console.warn(`Invalid value for ${sensor}: ${value}`);
        element.textContent = '--';
        element.className = 'color-yellow';
        return false;
      }

      element.textContent = numericValue.toFixed(1);
      
      if (numericValue >= threshold) {
        element.className = 'color-red reading';
        sendNotification(`${sensor} level high: ${numericValue.toFixed(1)}${unit}`, sensor);
        return true; // Alert condition
      } else {
        element.className = 'color-green reading';
        return false; // Normal condition
      }
    } catch (error) {
      console.error(`Error updating ${sensor} display:`, error);
      return false;
    }
  };

  /**
   * Generate realistic test data based on time patterns.
   */
  const generateTestData = () => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    
    // Simulate more realistic patterns - higher readings during "emergency" periods
    const isEmergencyTime = (hour >= 14 && hour <= 16) || (minute >= 45 && minute <= 59);
    const baseMultiplier = isEmergencyTime ? 2.5 : 1.0;
    
    return {
      co: (Math.random() * 100 * baseMultiplier + 50).toFixed(1),
      no2: (Math.random() * 5 * baseMultiplier + 1).toFixed(1),
      temp: (Math.random() * 20 + 15 + (baseMultiplier - 1) * 10).toFixed(1),
      humidity: (Math.random() * 40 + 30 + (baseMultiplier - 1) * 20).toFixed(1)
    };
  };

  /**
   * Main sensor value update function with modern async patterns.
   */
  const setSensorValues = async () => {
    try {
      console.log("setSensorValues - updating sensor readings");

      // Get DOM elements with error checking
      const elements = {
        co: document.getElementById("display-co"),
        no2: document.getElementById("display-no2"),
        temp: document.getElementById("display-tmp"),
        humidity: document.getElementById("display-hum")
      };

      // Verify all elements exist
      const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);
      
      if (missingElements.length > 0) {
        console.warn('Missing DOM elements:', missingElements);
      }

      // Get sensor data (simulated for now, will be replaced with real data)
      const readings = isConnectedToMobile ? 
        await getRealSensorData() : 
        generateTestData();

      // Update displays and check thresholds
      const alerts = {
        co: updateSensorDisplay(elements.co, readings.co, CO_RED, 'CO', ' ppm'),
        no2: updateSensorDisplay(elements.no2, readings.no2, NO2_RED, 'NO₂', ' ppm'),
        temp: notifyTmpHum ? updateSensorDisplay(elements.temp, readings.temp, TMP_RED, 'Temperature', '°C') : false,
        humidity: notifyTmpHum ? updateSensorDisplay(elements.humidity, readings.humidity, HUM_RED, 'Humidity', '%') : false
      };

      // Log alert status
      const activeAlerts = Object.entries(alerts).filter(([key, isAlert]) => isAlert);
      if (activeAlerts.length > 0) {
        console.warn('Active alerts:', activeAlerts.map(([key]) => key));
      }

      // Schedule next update
      setTimeout(setSensorValues, 3000);

    } catch (error) {
      console.error('Error in setSensorValues:', error);
      // Retry with exponential backoff on error
      setTimeout(setSensorValues, 5000);
    }
  };

  /**
   * Placeholder for real sensor data from mobile app.
   */
  const getRealSensorData = async () => {
    // TODO: Implement actual Bluetooth data reception
    // This will be connected to the Samsung Accessory Protocol
    return generateTestData();
  };

  // Initialize sensor monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setSensorValues);
  } else {
    setSensorValues();
  }

  // Expose functions for external use
  window.PyrrhaWatch = {
    setSensorValues,
    sendNotification,
    updateConnectionStatus: (connected) => {
      isConnectedToMobile = connected;
      console.log(`Mobile connection status: ${connected ? 'Connected' : 'Disconnected'}`);
    }
  };
})();
