/**
 * Pyrrha Watch App Control System - Galaxy Watch 3 Edition
 *
 * Enhanced screen management, hardware key handling, and rotating bezel support.
 */

(() => {
    "use strict";

    let isAppActive = true;
    let rotaryFocusIndex = 0;
    const focusableElements = [];

    /**
   * Enhanced hardware key management for Galaxy Watch 3.
   */
    const initializeHardwareKeys = () => {
        try {
            window.addEventListener("tizenhwkey", (event) => {
                console.log(`Hardware key pressed: ${event.keyName}`);

                switch (event.keyName) {
                case "back":
                    handleBackKey(event);
                    break;
                case "menu":
                    handleMenuKey(event);
                    break;
                default:
                    console.log(`Unhandled key: ${event.keyName}`);
                }
            });

            console.log("Hardware key listeners initialized");
        } catch (error) {
            console.error("Error initializing hardware keys:", error);
        }
    };

    /**
   * Handle back key press with proper navigation.
   */
    const handleBackKey = (event) => {
        try {
            const activePage = document.getElementsByClassName("ui-page-active")[0];
            const pageId = activePage ? activePage.id : "";

            // Close any open popups first
            if (typeof tau !== "undefined" && tau.isPopupActive && tau.isPopupActive()) {
                tau.closePopup();
                return;
            }

            // If on main page, exit app
            if (pageId === "details" || pageId === "main" || !pageId) {
                try {
                    if (typeof tizen !== "undefined" && tizen.application) {
                        tizen.application.getCurrentApplication().exit();
                    }
                } catch (exitError) {
                    console.warn("Could not exit application:", exitError);
                }
            } else {
                window.history.back();
            }
        } catch (error) {
            console.error("Error handling back key:", error);
        }
    };

    /**
   * Handle menu key press for quick actions.
   */
    const handleMenuKey = (event) => {
        try {
            // Toggle connection or show quick menu
            if (window.PyrrhaMobileConnection) {
                if (window.PyrrhaMobileConnection.isConnected()) {
                    window.PyrrhaMobileConnection.requestSensorData();
                } else {
                    window.PyrrhaMobileConnection.connect();
                }
            }
        } catch (error) {
            console.error("Error handling menu key:", error);
        }
    };

    /**
   * Enhanced power management for Galaxy Watch 3.
   */
    const initializePowerManagement = () => {
        try {
            if (typeof tizen === "undefined" || !tizen.power) {
                console.warn("Tizen power API not available");
                return;
            }

            // Screen state change listener
            tizen.power.setScreenStateChangeListener((prevState, currState) => {
                console.log(`Screen state changed: ${prevState} → ${currState}`);

                switch (currState) {
                case "SCREEN_NORMAL":
                    handleScreenWake(prevState);
                    break;
                case "SCREEN_DIM":
                    handleScreenDim();
                    break;
                case "SCREEN_OFF":
                    handleScreenOff();
                    break;
                }
            });

            // Screen brightness change listener
            tizen.power.setScreenBrightnessChangeListener((brightness) => {
                console.log(`Screen brightness changed: ${brightness}`);
                adjustUIForBrightness(brightness);
            });

            console.log("Power management initialized");
        } catch (error) {
            console.error("Error initializing power management:", error);
        }
    };

    /**
   * Handle screen wake with app refresh.
   */
    const handleScreenWake = (prevState) => {
        try {
            isAppActive = true;

            // Refresh sensor data when screen wakes up
            if (window.PyrrhaWatch && window.PyrrhaWatch.setSensorValues) {
                setTimeout(() => {
                    window.PyrrhaWatch.setSensorValues();
                }, 500);
            }

            // Request fresh data from mobile app if connected
            if (window.PyrrhaMobileConnection && window.PyrrhaMobileConnection.isConnected()) {
                setTimeout(() => {
                    window.PyrrhaMobileConnection.requestSensorData();
                }, 1000);
            }

            console.log("App refreshed on screen wake");
        } catch (error) {
            console.error("Error handling screen wake:", error);
        }
    };

    /**
   * Handle screen dimming.
   */
    const handleScreenDim = () => {
        isAppActive = false;
        console.log("Screen dimmed, reducing activity");
    };

    /**
   * Handle screen off.
   */
    const handleScreenOff = () => {
        isAppActive = false;
        console.log("Screen off, app backgrounded");
    };

    /**
   * Adjust UI based on screen brightness.
   */
    const adjustUIForBrightness = (brightness) => {
        try {
            const root = document.documentElement;

            if (brightness < 0.3) {
                // Very dim - enhance contrast
                root.style.setProperty("--primary-text", "#ffffff");
                root.style.setProperty("--secondary-text", "#eeeeee");
            } else if (brightness > 0.8) {
                // Very bright - reduce harsh contrasts
                root.style.setProperty("--primary-text", "#f0f0f0");
                root.style.setProperty("--secondary-text", "#cccccc");
            } else {
                // Normal brightness - default values
                root.style.setProperty("--primary-text", "#ffffff");
                root.style.setProperty("--secondary-text", "#cccccc");
            }
        } catch (error) {
            console.error("Error adjusting UI for brightness:", error);
        }
    };

    /**
   * Initialize rotating bezel support for Galaxy Watch 3.
   */
    const initializeRotaryNavigation = () => {
        try {
            if (typeof tau === "undefined") {
                console.warn("TAU framework not available for rotary navigation");
                return;
            }

            // Add rotary event listener
            document.addEventListener("rotarydetent", (event) => {
                handleRotaryInput(event.detail.direction);
            });

            // Initialize focusable elements
            updateFocusableElements();

            console.log("Rotary navigation initialized");
        } catch (error) {
            console.error("Error initializing rotary navigation:", error);
        }
    };

    /**
   * Handle rotating bezel input.
   */
    const handleRotaryInput = (direction) => {
        try {
            if (focusableElements.length === 0) {
                updateFocusableElements();
                return;
            }

            // Remove current focus
            if (focusableElements[rotaryFocusIndex]) {
                focusableElements[rotaryFocusIndex].classList.remove("rotary-focus");
            }

            // Update focus index
            if (direction === "CW") {
                rotaryFocusIndex = (rotaryFocusIndex + 1) % focusableElements.length;
            } else {
                rotaryFocusIndex = (rotaryFocusIndex - 1 + focusableElements.length) % focusableElements.length;
            }

            // Apply new focus
            if (focusableElements[rotaryFocusIndex]) {
                focusableElements[rotaryFocusIndex].classList.add("rotary-focus");
                focusableElements[rotaryFocusIndex].focus();
            }

            console.log(`Rotary focus: ${rotaryFocusIndex}/${focusableElements.length}`);
        } catch (error) {
            console.error("Error handling rotary input:", error);
        }
    };

    /**
   * Update list of focusable elements.
   */
    const updateFocusableElements = () => {
        try {
            focusableElements.length = 0;

            const selectors = [
                "#device-clock",
                "table tr",
                "#connect",
                "#fetch"
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element.offsetParent !== null) { // visible elements only
                        focusableElements.push(element);
                    }
                });
            });

            console.log(`Found ${focusableElements.length} focusable elements`);
        } catch (error) {
            console.error("Error updating focusable elements:", error);
        }
    };

    /**
   * Enhanced toast notification system.
   */
    const initializeToastSystem = () => {
        try {
            const toastPopup = document.getElementById("toast");

            if (toastPopup) {
                toastPopup.addEventListener("popupshow", (event) => {
                    // Auto-close toast after 4 seconds
                    setTimeout(() => {
                        if (typeof tau !== "undefined") {
                            tau.closePopup("#toast");
                        }
                    }, 4000);
                });

                // Handle toast tap to dismiss
                toastPopup.addEventListener("click", () => {
                    if (typeof tau !== "undefined") {
                        tau.closePopup("#toast");
                    }
                });
            }

            console.log("Toast system initialized");
        } catch (error) {
            console.error("Error initializing toast system:", error);
        }
    };

    /**
   * Update connection status indicator.
   */
    const updateConnectionIndicator = (connected, connecting = false) => {
        try {
            const indicator = document.getElementById("connection-status");
            if (indicator) {
                indicator.classList.remove("connected", "connecting");

                if (connecting) {
                    indicator.classList.add("connecting");
                    indicator.setAttribute("aria-label", "Connecting to mobile app");
                } else if (connected) {
                    indicator.classList.add("connected");
                    indicator.setAttribute("aria-label", "Connected to mobile app");
                } else {
                    indicator.setAttribute("aria-label", "Disconnected from mobile app");
                }
            }
        } catch (error) {
            console.error("Error updating connection indicator:", error);
        }
    };

    /**
   * Initialize all control systems.
   */
    const initialize = () => {
        try {
            console.log("Initializing Pyrrha Watch App controls...");

            initializeHardwareKeys();
            initializePowerManagement();
            initializeRotaryNavigation();
            initializeToastSystem();

            // Set up periodic UI updates
            setInterval(updateFocusableElements, 10000); // Update every 10 seconds

            console.log("All control systems initialized successfully");
        } catch (error) {
            console.error("Error during control system initialization:", error);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

    // Expose control functions globally
    window.PyrrhaWatchControl = {
        updateConnectionIndicator,
        isAppActive: () => isAppActive,
        refreshFocusableElements: updateFocusableElements,
        handleRotaryInput
    };

})();
