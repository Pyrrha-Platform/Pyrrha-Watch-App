/**
 * Pyrrha Tizen Web API code.
 *
 * Utilities for connecting with the mobile app.
 */

var SAAgent = null;
var SASocket = null;

/* ----------- UI entry points ----------- */

/**
 * Establish a connection
 */
function connect() {
  if (SASocket) {
    createHTML("Already connected!");
    document.getElementById("connect").innerText = "Disconnect";
    return false;
  }
  try {
    webapis.sa.requestSAAgent(onsuccess, function (err) {
      console.log("err [" + err.name + "] msg[" + err.message + "]");
    });
  } catch (err) {
    console.log("exception [" + err.name + "] msg[" + err.message + "]");
  }
}

/**
 * Fetch data.
 */
function fetch() {
  try {
    SASocket.sendData(CHANNELID, "Hello Accessory!");
  } catch (err) {
    console.log("exception [" + err.name + "] msg[" + err.message + "]");
  }
}

/**
 * Disconnect.
 */
function disconnect() {
  try {
    if (SASocket != null) {
      SASocket.close();
      SASocket = null;
      createHTML("closeConnection");
      document.getElementById("connect").innerText = "Connect";
    }
  } catch (err) {
    console.log("exception [" + err.name + "] msg[" + err.message + "]");
  }
}

/**
 * Create popup content to show messages in the UI.
 */
function createHTML(logString) {
  var content = document.getElementById("toast-content");
  content.textContent = logString;
  tau.openPopup("#toast");
}

/* ----------- Bluetooth callbacks ----------- */

/**
 * Callback for connecting to provider.
 */
var agentCallback = {
  onconnect: function (socket) {
    SASocket = socket;
    createHTML("PyrrhaWatch Connection established with RemotePeer");
    SASocket.setSocketStatusListener(function (reason) {
      console.log("Service connection lost, Reason : [" + reason + "]");
      disconnect();
    });
    SASocket.setDataReceiveListener(onreceive);
  },
  onerror: onerror,
};

/**
 * Callback for finding provider.
 */
var peerAgentFindCallback = {
  onpeeragentfound: function (peerAgent) {
    try {
      if (peerAgent.appName == ProviderAppName) {
        SAAgent.setServiceConnectionListener(agentCallback);
        SAAgent.requestServiceConnection(peerAgent);
      } else {
        createHTML("Not expected app!! : " + peerAgent.appName);
      }
    } catch (err) {
      console.log("exception [" + err.name + "] msg[" + err.message + "]");
    }
  },
  onerror: onerror,
};

/* ----------- Bluetooth event handlers ----------- */

/**
 * Handle success.
 */
function onsuccess(agents) {
  try {
    if (agents.length > 0) {
      SAAgent = agents[0];
      SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
      SAAgent.findPeerAgents();
      document.getElementById("connect").innerText = "Disconnect";
    } else {
      createHTML("Not found SAAgent!!");
    }
  } catch (err) {
    console.log("exception [" + err.name + "] msg[" + err.message + "]");
  }
}

/**
 * Log errors.
 */
function onerror(err) {
  console.log("err [" + err + "]");
  document.getElementById("connect").innerText = "Connect";
}

/**
 * Message handler.
 */
function onreceive(channelId, data) {
  createHTML(data);
}
