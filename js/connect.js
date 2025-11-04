/**
 * Pyrrha Tizen Web API code - Samsung Accessory Protocol Integration
 *
 * Modern utilities for connecting with the mobile app via Samsung Accessory Protocol.
 * Updated for Galaxy Watch 3 with improved error handling and connection management.
 */

// Connection state management
let SAAgent = null;
let SASocket = null;
let connectionState = "disconnected"; // 'disconnected', 'connecting', 'connected'
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 5000; // 5 seconds

/* ----------- Modern UI entry points ----------- */

/**
 * Establish connection with enhanced error handling and state management.
 */
const connect = async () => {
    try {
        if (SASocket && connectionState === "connected") {
            createHTML("Already connected to mobile app!");
            updateConnectButton("Disconnect");
            return false;
        }

        if (connectionState === "connecting") {
            createHTML("Connection in progress...");
            return false;
        }

        connectionState = "connecting";
        updateConnectButton("Connecting...");
        createHTML("Connecting to mobile app...");

        // Check if Samsung Accessory Service is available
        if (typeof webapis === "undefined" || !webapis.sa) {
            throw new Error("Samsung Accessory Service not available");
        }

        await new Promise((resolve, reject) => {
            webapis.sa.requestSAAgent(
                (agents) => onsuccess(agents, resolve, reject),
                (error) => {
                    console.error("SA Agent request failed:", error);
                    reject(new Error(`Failed to request SA Agent: ${error.name} - ${error.message}`));
                }
            );
        });

    } catch (error) {
        console.error("Connection error:", error);
        connectionState = "disconnected";
        updateConnectButton("Connect");
        createHTML(`Connection failed: ${error.message}`);

        // Auto-retry logic
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            createHTML(`Retrying connection (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
            setTimeout(connect, RECONNECT_DELAY);
        }
    }
};

/**
 * Request sensor data from mobile app.
 */
const requestSensorData = async () => {
    try {
        if (!SASocket || connectionState !== "connected") {
            throw new Error("Not connected to mobile app");
        }

        const request = {
            type: "sensor_request",
            timestamp: Date.now(),
            requestId: Math.random().toString(36).substr(2, 9)
        };

        SASocket.sendData(CHANNELID, JSON.stringify(request));
        console.log("Sensor data requested:", request.requestId);

    } catch (error) {
        console.error("Error requesting sensor data:", error);
        createHTML(`Data request failed: ${error.message}`);
    }
};

/**
 * Enhanced disconnect with proper cleanup.
 */
const disconnect = async () => {
    try {
        console.log("Disconnecting from mobile app...");

        if (SASocket) {
            SASocket.close();
            SASocket = null;
        }

        if (SAAgent) {
            // Clean up agent if needed
            SAAgent = null;
        }

        connectionState = "disconnected";
        reconnectAttempts = 0;
        updateConnectButton("Connect");
        createHTML("Disconnected from mobile app");

        // Update sensor display connection status
        if (window.PyrrhaWatch) {
            window.PyrrhaWatch.updateConnectionStatus(false);
        }

    } catch (error) {
        console.error("Error during disconnect:", error);
        createHTML(`Disconnect error: ${error.message}`);
    }
};

/**
 * Modern UI feedback with enhanced accessibility.
 */
const createHTML = (message, type = "info") => {
    try {
        const content = document.getElementById("toast-content");
        if (content) {
            content.textContent = message;
            content.setAttribute("role", "alert");
            content.setAttribute("aria-live", "polite");

            // Add visual feedback based on message type
            content.className = `toast-${type}`;

            if (typeof tau !== "undefined") {
                tau.openPopup("#toast");
            }

            console.log(`UI Message [${type}]: ${message}`);
        }
    } catch (error) {
        console.error("Error displaying message:", error);
    }
};

/**
 * Update connect button state.
 */
const updateConnectButton = (text) => {
    try {
        const connectButton = document.getElementById("connect");
        if (connectButton) {
            connectButton.textContent = text;
            connectButton.disabled = (text === "Connecting...");
        }
    } catch (error) {
        console.error("Error updating connect button:", error);
    }
};

/* ----------- Enhanced Samsung Accessory Protocol callbacks ----------- */

/**
 * Modern callback for connecting to mobile app provider.
 */
const agentCallback = {
    onconnect: (socket) => {
        try {
            SASocket = socket;
            connectionState = "connected";
            reconnectAttempts = 0;

            updateConnectButton("Disconnect");
            createHTML("Connected to Pyrrha mobile app!", "success");

            // Set up connection monitoring
            SASocket.setSocketStatusListener((reason) => {
                console.warn(`Connection lost, reason: ${reason}`);
                handleConnectionLoss(reason);
            });

            // Set up data reception with enhanced parsing
            SASocket.setDataReceiveListener(onDataReceive);

            // Update global connection status
            if (window.PyrrhaWatch) {
                window.PyrrhaWatch.updateConnectionStatus(true);
            }

            // Request initial sensor data
            setTimeout(requestSensorData, 1000);

        } catch (error) {
            console.error("Error in onconnect callback:", error);
            onerror(error);
        }
    },
    onerror: onerror
};

/**
 * Enhanced callback for finding mobile app provider.
 */
const peerAgentFindCallback = {
    onpeeragentfound: (peerAgent) => {
        try {
            console.log(`Found peer agent: ${peerAgent.appName}`);

            if (peerAgent.appName === ProviderAppName) {
                SAAgent.setServiceConnectionListener(agentCallback);
                SAAgent.requestServiceConnection(peerAgent);
                createHTML(`Connecting to ${ProviderAppName}...`, "info");
            } else {
                console.warn(`Unexpected app found: ${peerAgent.appName}`);
                createHTML(`Found ${peerAgent.appName}, looking for ${ProviderAppName}`, "warning");
            }
        } catch (error) {
            console.error("Error in peer agent found callback:", error);
            onerror(error);
        }
    },
    onerror: onerror
};

/* ----------- Enhanced Samsung Accessory Protocol event handlers ----------- */

/**
 * Handle successful SA Agent acquisition.
 */
const onsuccess = (agents, resolve, reject) => {
    try {
        console.log(`Found ${agents.length} SA agents`);

        if (agents.length > 0) {
            SAAgent = agents[0];
            SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
            SAAgent.findPeerAgents();

            createHTML("Searching for mobile app...", "info");
            resolve(agents);
        } else {
            const error = new Error("No Samsung Accessory agents found");
            console.error(error.message);
            reject(error);
        }
    } catch (error) {
        console.error("Error in onsuccess handler:", error);
        reject(error);
    }
};

/**
 * Enhanced error handler with recovery logic.
 */
const onerror = (error) => {
    console.error("Samsung Accessory Protocol error:", error);

    connectionState = "disconnected";
    updateConnectButton("Connect");

    const message = error.message || error.name || "Unknown connection error";
    createHTML(`Connection error: ${message}`, "error");

    // Reset connection state
    if (SASocket) {
        SASocket = null;
    }
    if (SAAgent) {
        SAAgent = null;
    }

    // Update global connection status
    if (window.PyrrhaWatch) {
        window.PyrrhaWatch.updateConnectionStatus(false);
    }
};

/**
 * Handle connection loss with reconnection logic.
 */
const handleConnectionLoss = (reason) => {
    console.warn(`Connection lost: ${reason}`);

    connectionState = "disconnected";
    updateConnectButton("Connect");
    createHTML(`Connection lost: ${reason}`, "warning");

    // Clean up
    SASocket = null;

    // Update global connection status
    if (window.PyrrhaWatch) {
        window.PyrrhaWatch.updateConnectionStatus(false);
    }

    // Auto-reconnect after delay
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setTimeout(() => {
            createHTML("Attempting to reconnect...", "info");
            connect();
        }, RECONNECT_DELAY);
    }
};

/**
 * Enhanced message handler with JSON parsing and sensor data processing.
 */
const onDataReceive = (channelId, data) => {
    try {
        console.log(`Received data on channel ${channelId}:`, data);

        // Try to parse JSON data from mobile app
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (parseError) {
            // Handle plain text messages
            createHTML(data, "info");
            return;
        }

        // Handle different types of messages
        switch (parsedData.type) {
        case "sensor_data":
            handleSensorData(parsedData);
            break;
        case "alert":
            handleAlert(parsedData);
            break;
        case "status":
            handleStatusUpdate(parsedData);
            break;
        default:
            console.log("Unknown message type:", parsedData.type);
            createHTML(`Received: ${parsedData.message || data}`, "info");
        }

    } catch (error) {
        console.error("Error processing received data:", error);
        createHTML(`Data processing error: ${error.message}`, "error");
    }
};

/**
 * Handle sensor data from mobile app.
 */
const handleSensorData = (data) => {
    try {
        console.log("Processing sensor data:", data);

        // Update sensor displays if we have the data
        if (data.sensors) {
            // TODO: Update actual sensor displays with real data
            // This will replace the simulated data in pyrrha.js
            createHTML("Sensor data updated", "success");
        }
    } catch (error) {
        console.error("Error handling sensor data:", error);
    }
};

/**
 * Handle alert messages from mobile app.
 */
const handleAlert = (data) => {
    try {
        console.log("Processing alert:", data);

        if (window.PyrrhaWatch && window.PyrrhaWatch.sendNotification) {
            window.PyrrhaWatch.sendNotification(data.message, data.severity || "warning");
        } else {
            createHTML(`Alert: ${data.message}`, "error");
        }
    } catch (error) {
        console.error("Error handling alert:", error);
    }
};

/**
 * Handle status updates from mobile app.
 */
const handleStatusUpdate = (data) => {
    try {
        console.log("Processing status update:", data);
        createHTML(`Status: ${data.message}`, "info");
    } catch (error) {
        console.error("Error handling status update:", error);
    }
};

// Expose functions for global access
window.PyrrhaMobileConnection = {
    connect,
    disconnect,
    requestSensorData,
    connectionState: () => connectionState,
    isConnected: () => connectionState === "connected"
};
