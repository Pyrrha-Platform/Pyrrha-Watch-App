/**
 * Battery Management System - Galaxy Watch 3 Edition
 * Enhanced power monitoring with modern JavaScript and better user experience
 */

(() => {
  "use strict";

  /**
   * Battery monitoring configuration for Galaxy Watch 3
   */
  const BATTERY_CONFIG = {
    // Critical battery level (4% = 0.04)
    criticalThreshold: 0.04,
    // Low battery warning level (15% = 0.15)
    lowThreshold: 0.15,
    // Very low battery level (8% = 0.08)
    veryLowThreshold: 0.08,
    // Check interval in milliseconds
    checkInterval: 30000, // 30 seconds
    // Grace period before exit (in milliseconds)
    exitGracePeriod: 10000 // 10 seconds
  };

  let batteryMonitor = null;
  let lastBatteryLevel = 1.0;
  let lowBatteryWarningShown = false;
  let exitTimer = null;

  /**
   * Enhanced battery monitoring system
   */
  class BatteryMonitor {
    constructor() {
      this.systemInfo = null;
      this.isInitialized = false;
      this.listeners = [];
    }

    /**
     * Initialize battery monitoring with enhanced features
     */
    async initialize() {
      try {
        if (typeof tizen !== "object" || !tizen.systeminfo) {
          console.warn("Tizen system info not available - battery monitoring disabled");
          return false;
        }

        this.systemInfo = tizen.systeminfo;
        this.isInitialized = true;

        // Initial battery check
        await this.checkCurrentBatteryState();
        
        // Set up continuous monitoring
        this.setupBatteryListener();
        this.startPeriodicCheck();

        console.log("Battery monitoring initialized successfully");
        return true;

      } catch (error) {
        console.error("Error initializing battery monitor:", error);
        return false;
      }
    }

    /**
     * Check current battery state with detailed logging
     */
    async checkCurrentBatteryState() {
      return new Promise((resolve, reject) => {
        try {
          this.systemInfo.getPropertyValue(
            "BATTERY",
            (battery) => {
              this.processBatteryUpdate(battery);
              resolve(battery);
            },
            (error) => {
              console.error("Error getting battery state:", error);
              reject(error);
            }
          );
        } catch (error) {
          console.error("Exception checking battery state:", error);
          reject(error);
        }
      });
    }

    /**
     * Setup battery change listener with enhanced monitoring
     */
    setupBatteryListener() {
      try {
        // Listen for critical battery level
        const criticalListener = this.systemInfo.addPropertyValueChangeListener(
          "BATTERY",
          (battery) => this.handleCriticalBattery(battery),
          { lowThreshold: BATTERY_CONFIG.criticalThreshold },
          (error) => console.error("Critical battery listener error:", error)
        );

        // Listen for low battery level
        const lowListener = this.systemInfo.addPropertyValueChangeListener(
          "BATTERY",
          (battery) => this.handleLowBattery(battery),
          { lowThreshold: BATTERY_CONFIG.lowThreshold },
          (error) => console.error("Low battery listener error:", error)
        );

        // Listen for general battery changes
        const generalListener = this.systemInfo.addPropertyValueChangeListener(
          "BATTERY",
          (battery) => this.processBatteryUpdate(battery),
          {},
          (error) => console.error("Battery listener error:", error)
        );

        this.listeners.push(criticalListener, lowListener, generalListener);
        console.log("Battery listeners setup successfully");

      } catch (error) {
        console.error("Error setting up battery listeners:", error);
      }
    }

    /**
     * Start periodic battery check
     */
    startPeriodicCheck() {
      setInterval(() => {
        if (this.isInitialized) {
          this.checkCurrentBatteryState().catch(error => {
            console.warn("Periodic battery check failed:", error);
          });
        }
      }, BATTERY_CONFIG.checkInterval);
    }

    /**
     * Process battery update with comprehensive handling
     */
    processBatteryUpdate(battery) {
      try {
        const level = Math.round(battery.level * 100);
        const isCharging = battery.isCharging;
        const hasChanged = Math.abs(battery.level - lastBatteryLevel) > 0.01;

        if (hasChanged) {
          console.log(`Battery: ${level}% (${isCharging ? 'charging' : 'discharging'})`);
          lastBatteryLevel = battery.level;
        }

        // Update UI battery indicator if available
        this.updateBatteryUI(battery);

        // Handle different battery states
        if (battery.level <= BATTERY_CONFIG.criticalThreshold && !isCharging) {
          this.handleCriticalBattery(battery);
        } else if (battery.level <= BATTERY_CONFIG.veryLowThreshold && !isCharging) {
          this.handleVeryLowBattery(battery);
        } else if (battery.level <= BATTERY_CONFIG.lowThreshold && !isCharging) {
          this.handleLowBattery(battery);
        } else if (isCharging && lowBatteryWarningShown) {
          this.handleChargingStarted(battery);
        }

      } catch (error) {
        console.error("Error processing battery update:", error);
      }
    }

    /**
     * Handle critical battery level with graceful shutdown
     */
    handleCriticalBattery(battery) {
      try {
        const level = Math.round(battery.level * 100);
        console.warn(`Critical battery level: ${level}%`);

        // Show critical battery notification
        this.showBatteryNotification(
          `Critical battery: ${level}%\nApp will close in 10 seconds`,
          'critical'
        );

        // Graceful shutdown with delay
        if (exitTimer) {
          clearTimeout(exitTimer);
        }

        exitTimer = setTimeout(() => {
          try {
            console.log("Exiting app due to critical battery level");
            if (tizen && tizen.application) {
              tizen.application.getCurrentApplication().exit();
            }
          } catch (error) {
            console.error("Error exiting application:", error);
          }
        }, BATTERY_CONFIG.exitGracePeriod);

      } catch (error) {
        console.error("Error handling critical battery:", error);
      }
    }

    /**
     * Handle very low battery level
     */
    handleVeryLowBattery(battery) {
      try {
        const level = Math.round(battery.level * 100);
        console.warn(`Very low battery: ${level}%`);

        this.showBatteryNotification(
          `Very low battery: ${level}%\nPlease charge soon`,
          'warning'
        );

        // Reduce app activity to conserve power
        this.enablePowerSaveMode();

      } catch (error) {
        console.error("Error handling very low battery:", error);
      }
    }

    /**
     * Handle low battery level with user notification
     */
    handleLowBattery(battery) {
      try {
        const level = Math.round(battery.level * 100);
        
        if (!lowBatteryWarningShown) {
          console.warn(`Low battery warning: ${level}%`);
          
          this.showBatteryNotification(
            `Low battery: ${level}%\nConsider charging`,
            'info'
          );
          
          lowBatteryWarningShown = true;
        }

      } catch (error) {
        console.error("Error handling low battery:", error);
      }
    }

    /**
     * Handle charging started
     */
    handleChargingStarted(battery) {
      try {
        console.log("Charging started, clearing low battery warnings");
        
        lowBatteryWarningShown = false;
        
        if (exitTimer) {
          clearTimeout(exitTimer);
          exitTimer = null;
        }

        // Show charging notification
        this.showBatteryNotification("Charging started", 'success');
        
        // Disable power save mode
        this.disablePowerSaveMode();

      } catch (error) {
        console.error("Error handling charging started:", error);
      }
    }

    /**
     * Show battery notification to user
     */
    showBatteryNotification(message, type = 'info') {
      try {
        // Use app's notification system if available
        if (window.PyrrhaWatch && window.PyrrhaWatch.sendNotification) {
          window.PyrrhaWatch.sendNotification(message, type);
        } else if (typeof createHTML === 'function') {
          createHTML(message, type);
        } else {
          console.log(`Battery notification: ${message}`);
        }
      } catch (error) {
        console.error("Error showing battery notification:", error);
      }
    }

    /**
     * Enable power save mode
     */
    enablePowerSaveMode() {
      try {
        console.log("Enabling power save mode");
        
        // Reduce update frequency
        if (window.PyrrhaWatch) {
          // Could implement reduced update intervals here
        }

        // Dim display elements
        document.body.classList.add('power-save-mode');

      } catch (error) {
        console.error("Error enabling power save mode:", error);
      }
    }

    /**
     * Disable power save mode
     */
    disablePowerSaveMode() {
      try {
        console.log("Disabling power save mode");
        
        // Restore normal operation
        document.body.classList.remove('power-save-mode');

      } catch (error) {
        console.error("Error disabling power save mode:", error);
      }
    }

    /**
     * Update battery UI indicator
     */
    updateBatteryUI(battery) {
      try {
        // Add battery level to connection status area if desired
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
          const level = Math.round(battery.level * 100);
          statusElement.setAttribute('title', 
            `Battery: ${level}% (${battery.isCharging ? 'charging' : 'discharging'})`);
        }
      } catch (error) {
        console.error("Error updating battery UI:", error);
      }
    }

    /**
     * Clean up battery monitoring
     */
    cleanup() {
      try {
        if (exitTimer) {
          clearTimeout(exitTimer);
          exitTimer = null;
        }

        // Remove listeners if possible
        this.listeners.forEach(listener => {
          try {
            // Tizen doesn't provide a direct way to remove listeners
            // but they'll be cleaned up when the app exits
          } catch (error) {
            console.warn("Error removing battery listener:", error);
          }
        });

        this.isInitialized = false;
        console.log("Battery monitor cleaned up");

      } catch (error) {
        console.error("Error during battery monitor cleanup:", error);
      }
    }
  }

  /**
   * Initialize battery monitoring system
   */
  const initializeBatteryMonitoring = async () => {
    try {
      batteryMonitor = new BatteryMonitor();
      const success = await batteryMonitor.initialize();
      
      if (success) {
        console.log("Advanced battery monitoring active");
        
        // Add power save mode CSS
        const style = document.createElement('style');
        style.textContent = `
          .power-save-mode {
            filter: brightness(0.7);
            transition: filter 0.5s ease;
          }
          .power-save-mode * {
            animation-duration: 2s !important;
          }
        `;
        document.head.appendChild(style);
      }

    } catch (error) {
      console.error("Failed to initialize battery monitoring:", error);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBatteryMonitoring);
  } else {
    initializeBatteryMonitoring();
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (batteryMonitor) {
      batteryMonitor.cleanup();
    }
  });

  // Expose battery monitor for external access
  window.PyrrhaWatchBattery = {
    getMonitor: () => batteryMonitor,
    isLowBattery: () => lastBatteryLevel <= BATTERY_CONFIG.lowThreshold,
    getCurrentLevel: () => Math.round(lastBatteryLevel * 100)
  };

})();
