/**
 * Circle Helper - Galaxy Watch 3 Edition
 * Enhanced circular UI support with modern JavaScript
 */

(() => {
    "use strict";

    /**
   * Initialize circular UI enhancements for Galaxy Watch 3.
   */
    const initializeCircularUI = () => {
        try {
            // Check if running on circular device
            if (typeof tau === "undefined") {
                console.warn("TAU framework not available");
                return;
            }

            if (!tau.support || !tau.support.shape || !tau.support.shape.circle) {
                console.log("Non-circular device detected, skipping circular enhancements");
                return;
            }

            console.log("Initializing circular UI enhancements for Galaxy Watch 3");

            // Enhanced page lifecycle management
            document.addEventListener("pagebeforeshow", handlePageBeforeShow);
            document.addEventListener("pageshow", handlePageShow);
            document.addEventListener("pagehide", handlePageHide);

            // Initialize circular-specific features
            initializeCircularTable();
            initializeRotaryScrolling();
            initializeCircularAnimations();

            console.log("Circular UI enhancements initialized successfully");
        } catch (error) {
            console.error("Error initializing circular UI:", error);
        }
    };

    /**
   * Handle page before show event with circular optimizations.
   */
    const handlePageBeforeShow = (event) => {
        try {
            const page = event.target;
            console.log(`Page before show: ${page.id}`);

            // Initialize any list views with circular support
            const listViews = page.querySelectorAll(".ui-listview");
            listViews.forEach(list => {
                try {
                    tau.widget.ArcListview(list);
                } catch (error) {
                    console.warn("Could not initialize ArcListview:", error);
                }
            });

            // Apply circular layout optimizations
            applyCircularLayout(page);

        } catch (error) {
            console.error("Error in pagebeforeshow handler:", error);
        }
    };

    /**
   * Handle page show event.
   */
    const handlePageShow = (event) => {
        try {
            const page = event.target;
            console.log(`Page shown: ${page.id}`);

            // Refresh circular animations
            refreshCircularAnimations(page);

        } catch (error) {
            console.error("Error in pageshow handler:", error);
        }
    };

    /**
   * Handle page hide event.
   */
    const handlePageHide = (event) => {
        try {
            const page = event.target;
            console.log(`Page hidden: ${page.id}`);

            // Clean up any circular-specific resources
            cleanupCircularResources(page);

        } catch (error) {
            console.error("Error in pagehide handler:", error);
        }
    };

    /**
   * Initialize circular table layout for sensor data.
   */
    const initializeCircularTable = () => {
        try {
            const table = document.querySelector("table");
            if (table) {
                table.classList.add("circular-optimized");

                // Add circular-specific styling
                table.style.borderRadius = "15px";
                table.style.overflow = "hidden";

                // Optimize row spacing for circular display
                const rows = table.querySelectorAll("tr");
                rows.forEach((row, index) => {
                    row.style.animationDelay = `${index * 0.1}s`;
                    row.classList.add("fade-in-circular");
                });
            }
        } catch (error) {
            console.error("Error initializing circular table:", error);
        }
    };

    /**
   * Initialize rotary scrolling for circular navigation.
   */
    const initializeRotaryScrolling = () => {
        try {
            // Enable smooth scrolling with rotary input
            const scrollableElements = document.querySelectorAll(".ui-content, table");

            scrollableElements.forEach(element => {
                element.addEventListener("scroll", (event) => {
                    // Add smooth scrolling feedback
                    element.style.transform = `scale(${0.98 + (element.scrollTop / 1000) * 0.02})`;
                });
            });

        } catch (error) {
            console.error("Error initializing rotary scrolling:", error);
        }
    };

    /**
   * Initialize circular-specific animations.
   */
    const initializeCircularAnimations = () => {
        try {
            // Add CSS for circular animations if not already present
            if (!document.getElementById("circular-animations")) {
                const style = document.createElement("style");
                style.id = "circular-animations";
                style.textContent = `
          .fade-in-circular {
            animation: fadeInCircular 0.8s ease-out forwards;
            opacity: 0;
          }
          
          @keyframes fadeInCircular {
            0% {
              opacity: 0;
              transform: scale(0.8) rotate(-5deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          
          .circular-optimized {
            border-radius: 50% / 20%;
            transition: all 0.3s ease;
          }
          
          .circular-pulse {
            animation: circularPulse 2s infinite;
          }
          
          @keyframes circularPulse {
            0%, 100% {
              border-radius: 15px;
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
            }
            50% {
              border-radius: 20px;
              box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
          }
        `;
                document.head.appendChild(style);
            }
        } catch (error) {
            console.error("Error initializing circular animations:", error);
        }
    };

    /**
   * Apply circular layout optimizations to a page.
   */
    const applyCircularLayout = (page) => {
        try {
            // Optimize content positioning for circular display
            const content = page.querySelector(".ui-content");
            if (content) {
                content.style.padding = "20px";
                content.style.borderRadius = "50%";
                content.style.background = "radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)";
            }

            // Optimize clock display for circular layout
            const clock = page.querySelector("#device-clock");
            if (clock) {
                clock.classList.add("circular-pulse");
            }

            // Optimize table for circular display
            const table = page.querySelector("table");
            if (table) {
                table.classList.add("circular-optimized");
            }

        } catch (error) {
            console.error("Error applying circular layout:", error);
        }
    };

    /**
   * Refresh circular animations on page.
   */
    const refreshCircularAnimations = (page) => {
        try {
            const animatedElements = page.querySelectorAll(".fade-in-circular");
            animatedElements.forEach((element, index) => {
                element.style.animation = "none";
                setTimeout(() => {
                    element.style.animation = `fadeInCircular 0.8s ease-out ${index * 0.1}s forwards`;
                }, 50);
            });
        } catch (error) {
            console.error("Error refreshing circular animations:", error);
        }
    };

    /**
   * Clean up circular-specific resources.
   */
    const cleanupCircularResources = (page) => {
        try {
            // Remove any temporary circular enhancements
            const temporaryElements = page.querySelectorAll(".temp-circular");
            temporaryElements.forEach(element => element.remove());
        } catch (error) {
            console.error("Error cleaning up circular resources:", error);
        }
    };

    /**
   * Public API for circular UI management.
   */
    const CircularUIManager = {
        initialize: initializeCircularUI,
        applyLayout: applyCircularLayout,
        refreshAnimations: refreshCircularAnimations,
        isCircularDevice: () => {
            return typeof tau !== "undefined" &&
             tau.support &&
             tau.support.shape &&
             tau.support.shape.circle;
        }
    };

    // Initialize when TAU is ready
    if (typeof tau !== "undefined") {
        initializeCircularUI();
    } else {
    // Wait for TAU to load
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(initializeCircularUI, 100);
        });
    }

    // Expose to global scope
    window.CircularUIManager = CircularUIManager;

})();
