/**
 * Pyrrha Watch App Constants - Galaxy Watch 3 Edition
 * 
 * Should be consistent with:
 * https://github.com/Pyrrha-Platform/Pyrrha-Dashboard/blob/main/pyrrha-dashboard/src/utils/Constants.js
 */

// Sensor threshold constants (matching Dashboard values)
const SENSOR_THRESHOLDS = {
  // Temperature threshold in Celsius
  TMP_RED: 32,
  // Humidity threshold in percentage
  HUM_RED: 80,
  // Carbon Monoxide threshold in ppm
  CO_RED: 420,
  // Nitrogen Dioxide threshold in ppm
  NO2_RED: 8
};

// Legacy constants for backward compatibility
const TMP_RED = SENSOR_THRESHOLDS.TMP_RED;
const HUM_RED = SENSOR_THRESHOLDS.HUM_RED;
const CO_RED = SENSOR_THRESHOLDS.CO_RED;
const NO2_RED = SENSOR_THRESHOLDS.NO2_RED;

// UI Configuration for Galaxy Watch 3
const UI_CONFIG = {
  // Use toast notifications (true) or Tizen notifications (false)
  useToast: true,
  // Enable temperature and humidity notifications
  notifyTmpHum: false,
  // Update intervals in milliseconds
  sensorUpdateInterval: 3000,
  clockUpdateInterval: 1000,
  // Notification settings
  notificationCooldown: 30000, // 30 seconds between same type notifications
  maxReconnectAttempts: 3,
  reconnectDelay: 5000 // 5 seconds
};

// Legacy UI settings for backward compatibility
const useToast = UI_CONFIG.useToast;
const notifyTmpHum = UI_CONFIG.notifyTmpHum;

// Samsung Accessory Protocol Configuration
const ACCESSORY_CONFIG = {
  // Communication channel ID
  channelId: 104,
  // Expected mobile app provider name
  providerAppName: "PyrrhaMobileProvider",
  // Protocol version
  protocolVersion: "2.0",
  // Service profile
  serviceProfile: "/org/pyrrha-platform/readings"
};

// Legacy Bluetooth settings for backward compatibility
const CHANNELID = ACCESSORY_CONFIG.channelId;
const ProviderAppName = ACCESSORY_CONFIG.providerAppName;

// Message Types for Samsung Accessory Protocol
const MESSAGE_TYPES = {
  SENSOR_REQUEST: 'sensor_request',
  SENSOR_DATA: 'sensor_data',
  ALERT: 'alert',
  STATUS: 'status',
  HEARTBEAT: 'heartbeat'
};

// Watch-specific Configuration
const WATCH_CONFIG = {
  // Galaxy Watch 3 specific features
  supportsRotatingBezel: true,
  supportsCircularUI: true,
  supportsAdvancedHaptics: true,
  // Display settings
  screenShape: 'circle',
  screenSize: 'normal',
  // Power management
  backgroundSupport: true,
  // Sensor data retention
  maxDataPoints: 100,
  dataRetentionHours: 24
};

// App Information
const APP_INFO = {
  name: "Pyrrha",
  version: "2.0.0",
  targetPlatform: "Galaxy Watch 3",
  tizenVersion: "5.5",
  buildDate: new Date().toISOString().split('T')[0]
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SENSOR_THRESHOLDS,
    UI_CONFIG,
    ACCESSORY_CONFIG,
    MESSAGE_TYPES,
    WATCH_CONFIG,
    APP_INFO,
    // Legacy exports
    TMP_RED, HUM_RED, CO_RED, NO2_RED,
    useToast, notifyTmpHum,
    CHANNELID, ProviderAppName
  };
}
